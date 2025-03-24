import { TagType } from "@/src/types/TagType";
import { Firestore, FirestoreError, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { Octokit } from "octokit";
import FirestoreService from "../firebase/firestore/FirestoreService";
import { GitHubIntegrationType } from "@/src/types/IntegrationType";
import { integrationConverter } from "../firebase/converter/IntegrationConverter";

export default class GithubService extends FirestoreService {
    dbFirestore: Firestore;
    octokit: Octokit;

    constructor(token: string) {
        super()
        this.dbFirestore = getFirestore();
        this.octokit = new Octokit({
            auth: token,
        });
    }

    getGitHubData(integrationId: string): Promise<GitHubIntegrationType | undefined> {
        return new Promise((resolve, reject) => {
            const docData = doc(this.dbFirestore, this.getCollectionIntegrations(), integrationId).withConverter(integrationConverter);
            getDoc(docData)
                .then((doc) => {
                    const Integration = doc.data()?.GitHubIntegration
                    if (Integration !== undefined) {
                        resolve(Integration);
                    } 

                    resolve(undefined)
                })
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code));
                })
        })
    }

    async createRepositoryGitHubIntegration(data: GitHubIntegrationType): Promise<void> {
        return new Promise((resolve, reject) => {
            const docData = doc(this.dbFirestore, this.getCollectionIntegrations(), data.id)
            setDoc(docData, { GitHubIntegration: data })
                .then(async () => {
                    try {
                        const response = await this.octokit.request('POST /user/repos', {
                            name: data.repoName,
                            private: true,
                            auto_init: true,
                        });
                        resolve()
                    } catch (error: any) {
                        if (error.status === 422) {
                            reject('Repositório já existente');
                        } else {
                            reject('Erro ao criar repositório');
                        }
                    }
                })
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }

    async updateGitHubRepositoryIntegration(data: GitHubIntegrationType, newRepoName: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const docData = doc(this.dbFirestore, this.getCollectionIntegrations(), data.id)
            updateDoc(docData, { GitHubIntegration: data })
                .then(async () => {
                    try {
                        const response = await this.octokit.request('PATCH /repos/{owner}/{repoName}', {
                            owner: data.userName,
                            repoName: data.repoName,
                            name: newRepoName,
                            private: true,
                            auto_init: false,
                        });
                        const repoName = response.data.name;
                        resolve(repoName)
                    } catch (error: any) {
                        reject('Erro ao atualizar repositório')
                    }
                })
                .catch((error: FirestoreError) => {
                    reject(this.errorMessage(error.code))
                })
        })
    }

    async createLabelGitHubIntegration(owner: string, repo: string, tag: TagType) {
        try {
            const existingLabel = await this.octokit.request('GET /repos/{owner}/{repo}/labels/{name}', {
                owner: owner,
                repo: repo,
                name: tag.tag,
            });
            return existingLabel;
        } catch (error) {
            const colorWithoutHash = tag.color.substring(1);
            return this.octokit.request('POST /repos/{owner}/{repo}/labels', {
                owner: owner,
                repo: repo,
                name: tag.tag,
                description: tag.description,
                color: colorWithoutHash,
            });
        }
    }

    async createIssueGitHubIntegration(ownerOfRepository: string, repository: string, issueTitle: string, descriptionOfIssue: string, tags: TagType[]): Promise<number> {
        return new Promise(async (resolve, reject) => {
            try {
                const createdLabels = await Promise.all(tags.map(tag => this.createLabelGitHubIntegration(ownerOfRepository, repository, tag)));
                const labelNames = createdLabels.map(label => label.data.name);

                const response = await this.octokit.request('POST /repos/{owner}/{repo}/issues', {
                    owner: ownerOfRepository,
                    repo: repository,
                    title: issueTitle,
                    body: descriptionOfIssue,
                    labels: labelNames,
                });
                const issueNumber = response.data.number;
                resolve(issueNumber)
            } catch (error: any) {
                reject(`Erro ao criar issue: ${error.message}`)
            }
        })
    }

    async updateIssueGitHubIntegration(ownerOfRepository: string, repository: string, numberOfIssue: number, issueTitle: string, descriptionOfIssue: string, tags: TagType[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const createdLabels = await Promise.all(tags.map(tag => this.createLabelGitHubIntegration(ownerOfRepository, repository, tag)));
                const labelNames = createdLabels.map(label => label.data.name);

                const response = await this.octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
                    owner: ownerOfRepository,
                    repo: repository,
                    issue_number: numberOfIssue,
                    title: issueTitle,
                    body: descriptionOfIssue,
                    labels: labelNames,
                });
                resolve()
            } catch (error: any) {
                reject(error.message)
            }
        })
    }

    async reOpenIssueGitHubIntegration(ownerOfRepository: string, repository: string, numberOfIssue: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
                    owner: ownerOfRepository,
                    repo: repository,
                    issue_number: numberOfIssue,
                    state: 'open',
                });
                resolve()
            } catch (error: any) {
                reject(error.message)
            }
        })
    }

    async closeIssueGitHubIntegration(ownerOfRepository: string, repository: string, numberOfIssue: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
                    owner: ownerOfRepository,
                    repo: repository,
                    issue_number: numberOfIssue,
                    state: 'closed',
                });
                resolve()
            } catch (error: any) {
                reject(error.message)
            }
        })
    }

}