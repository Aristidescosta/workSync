
export type IntegrationType = {
    GitHubIntegration:GitHubIntegrationType
}

export type GitHubIntegrationType = {
    id:string,
    repoName: string,
    userName: string,
    token: string,
}
