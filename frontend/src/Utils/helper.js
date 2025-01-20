export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for validating an email address
    return regex.test(email); // Returns true if email matches the regex, otherwise false
};

export const getInitials=(name)=>{

    if(!name) return "";

    const words=name.split(" ");
    let initials="";

    for(let i=0;i<Math.min(words.length,2);i++){
        initials+=words[i][0];
    }

    return initials.toUpperCase();


}