String.prototype.getInitials = function (): string {
    const words = this.split(' ').filter(Boolean);

    const firstName = words[0];
    const lastName = words[words.length - 1];

    return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
};