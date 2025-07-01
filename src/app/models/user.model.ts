export interface User {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  location?: string;
  bio?: string;
  gender?: string;
  birthdate?: string;
  lookingfor?: string;
  sexualorientation?: string;
  professionindustry?: string;

  // Add this manually, even though it's not in the DB — you’ll add it later
  profile_picture?: string;
}

  export interface SignupData {
    username: string;
    email: string;
    password: string;
  }
  