export interface SignInInput {
  input: {
    cedula: string
    email: string
    nombre: string
    apellidos: string
    direccion: string
    password: string
    rol: string
  }
}

export interface SignUpInput {
  input: {
    responsableId: string
    password: string
  }
}

export interface DeleteUserInput {
  input: {
    responsable: string
    cedula: string
  }
}

export interface ActivateUserInput {
  input: {
    responsable: string
    cedula: string
  }
}

export interface EditUserInput {
  input: {
    cedulaActual: string
    emailActual: string
    cedula: string
    email: string
    nombre: string
    apellidos: string
    direccion: string
    rol: string
    responsable: string
  }
}

export interface EditPasswordInput {
  input: {
    oldPassword: string
    newPassword: string
    responsable: string
  }
}

export interface RequestPasswordResetInput {
  input: {
    email: string
    domain: string
  }
}

export interface ResetPasswordInput {
  input: {
    token: string
    password: string
  }
}
