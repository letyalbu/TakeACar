interface ICreateUserDTO {
  id?: string;
  name: string;
  password: string;
  email: string;
  avatar?: string;
  driver_license: string;
}

export { ICreateUserDTO };
