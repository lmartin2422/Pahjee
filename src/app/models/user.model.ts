export interface User {
    username: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    profile_picture?: string;
    location?: string;
    bio?: string;
    gender?: string;
    birthdate?: string;
    lookingfor?: string;
    sexualorientation?: string;
    professionindustry?: string;
  }
  
  export interface SignupData {
    username: string;
    email: string;
    password: string;
  }
  