import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import {
  CustomContext,
  GraphqlRoot,
  ResetPasswordData,
  SecurityData,
  User,
} from '../../types'
import { v4 as uuidv4 } from 'uuid'
import {
  internalServerError,
  getToken,
  hasData,
  TokenData,
  isAuthorized,
  sendPasswordResetEmail,
} from '../../utils'
import { AppConstants } from '../../utils/constants'
import {
  createUser,
  deleteUser,
  editUser,
  getUsers,
  login,
  userExist,
  passwordCanBeUsed,
  availablePassword,
  editPassword,
  activateUser,
  verifyLoginPassword,
  getSecurityData,
  updateSecurityInformation,
  blockAccount,
  savePasswordReset,
  getResetPasswordData,
  resetPassword,
} from './helpers'
import {
  DeleteUserInput,
  EditUserInput,
  SignInInput,
  SignUpInput,
  EditPasswordInput,
  ActivateUserInput,
  RequestPasswordResetInput,
  ResetPasswordInput,
} from './types'

export const resolvers = {
  Query: {
    signUp: async (_: GraphqlRoot, { input }: SignUpInput) => {
      const { responsableId, password } = input
      const userData: User = await login(responsableId)

      if (!hasData(userData)) {
        return {
          code: AppConstants.ERROR_SIGNUP_DOES_NOT_MATCH,
        }
      }

      const securityData = await getSecurityData(responsableId)

      if (!hasData(securityData)) {
        internalServerError('Graphql internal error')
      }

      const {
        cuentaActiva,
        passwordExpirado,
        passwordBloqueado,
        intentosExcedido,
      } = securityData as SecurityData

      if (!cuentaActiva) {
        return {
          code: AppConstants.ERROR_INACTIVE_ACCOUNT,
        }
      }

      if (passwordExpirado) {
        return {
          code: AppConstants.ERROR_EXPIRED_PASSWORD,
        }
      }

      if (passwordBloqueado) {
        return {
          code: AppConstants.ERROR_BLOCKED_PASSWORD,
        }
      }

      if (intentosExcedido) {
        await blockAccount(responsableId)
        return {
          code: AppConstants.ERROR_ATTEMPTS_EXCEEDED,
        }
      }

      const isPasswordEqual = await verifyLoginPassword(
        password,
        userData?.password || '',
      )

      if (!isPasswordEqual) {
        await updateSecurityInformation(responsableId)
        return {
          code: AppConstants.ERROR_SIGNUP_DOES_NOT_MATCH,
        }
      }

      const { cedula, email } = userData || {}

      const authorization = getToken({ cedula, email } as TokenData, '')

      return {
        code: 'SUCCESS',
        user: { ...userData },
        authorization,
      }
    },
    getUsers: async (
      _: GraphqlRoot,
      __: unknown,
      { auth: { isAuth, user } }: CustomContext,
    ) => {
      if (!isAuth) {
        throw new AuthenticationError(AppConstants.AUTHENTICATION_ERROR)
      }

      if (!isAuthorized(user?.rol || '', AppConstants.ACCESS_POLICY_ADMIN)) {
        throw new ForbiddenError(AppConstants.FORBIDDEN_ERROR)
      }

      const userData: User[] = await getUsers()

      return userData
    },
  },

  Mutation: {
    signIn: async (
      _: GraphqlRoot,
      user: SignInInput,
      { auth: { isAuth, user: userAuth } }: CustomContext,
    ) => {
      if (!isAuth) {
        throw new AuthenticationError(AppConstants.AUTHENTICATION_ERROR)
      }

      if (
        !isAuthorized(userAuth?.rol || '', AppConstants.ACCESS_POLICY_ADMIN)
      ) {
        throw new ForbiddenError(AppConstants.FORBIDDEN_ERROR)
      }

      const { cedula, email } = user.input

      if (await userExist({ email })) {
        return {
          code: AppConstants.ERROR_EMAIL_USED,
        }
      }

      if (await userExist({ id: cedula })) {
        return {
          code: AppConstants.ERROR_ID_USED,
        }
      }

      const success = await createUser(user)

      if (!success) {
        internalServerError('Was not able to create a new user')
      }

      const { nombre, apellidos, direccion, rol } = user.input
      const authorization = getToken({ cedula, email }, '')

      return {
        code: 'SUCCESS',
        user: { cedula, email, nombre, apellidos, direccion, rol },
        authorization,
      }
    },
    deleteUser: async (
      _: GraphqlRoot,
      input: DeleteUserInput,
      { auth: { isAuth, user } }: CustomContext,
    ) => {
      if (!isAuth) {
        throw new AuthenticationError(AppConstants.AUTHENTICATION_ERROR)
      }

      if (!isAuthorized(user?.rol || '', AppConstants.ACCESS_POLICY_ADMIN)) {
        throw new ForbiddenError(AppConstants.FORBIDDEN_ERROR)
      }

      const success = await deleteUser(input)

      if (!success) {
        internalServerError(
          'Was not able to delete the user from the database.',
        )
      }

      return {
        code: 'SUCCESS',
      }
    },
    activateUser: async (
      _: GraphqlRoot,
      input: ActivateUserInput,
      { auth: { isAuth, user } }: CustomContext,
    ) => {
      if (!isAuth) {
        throw new AuthenticationError(AppConstants.AUTHENTICATION_ERROR)
      }

      if (!isAuthorized(user?.rol || '', AppConstants.ACCESS_POLICY_ADMIN)) {
        throw new ForbiddenError(AppConstants.FORBIDDEN_ERROR)
      }

      const success = await activateUser(input)

      if (!success) {
        internalServerError(
          'Was not able to activate the user from the database.',
        )
      }

      return {
        code: 'SUCCESS',
      }
    },
    editUser: async (
      _: GraphqlRoot,
      user: EditUserInput,
      { auth: { isAuth, user: userAuth } }: CustomContext,
    ) => {
      if (!isAuth) {
        throw new AuthenticationError(AppConstants.AUTHENTICATION_ERROR)
      }

      if (
        !isAuthorized(userAuth?.rol || '', AppConstants.ACCESS_POLICY_ADMIN)
      ) {
        throw new ForbiddenError(AppConstants.FORBIDDEN_ERROR)
      }

      const { cedula, email, cedulaActual, emailActual } = user.input

      if (email !== emailActual && (await userExist({ email }))) {
        return {
          code: AppConstants.ERROR_EMAIL_USED,
        }
      }

      if (cedula !== cedulaActual && (await userExist({ id: cedula }))) {
        return {
          code: AppConstants.ERROR_ID_USED,
        }
      }

      const success = await editUser(user)

      if (!success) {
        internalServerError('Was not able to edit the user from the database.')
      }

      return {
        code: 'SUCCESS',
      }
    },
    editPassword: async (
      _: GraphqlRoot,
      { input }: EditPasswordInput,
      { auth: { isAuth } }: CustomContext,
    ) => {
      if (!isAuth) {
        throw new AuthenticationError(AppConstants.AUTHENTICATION_ERROR)
      }

      const { oldPassword, newPassword, responsable } = input

      if (await passwordCanBeUsed(responsable, oldPassword)) {
        return {
          code: AppConstants.ERROR_CURRENT_PASSWORD_DO_NOT_MATCH,
        }
      }

      if (!(await availablePassword(responsable, newPassword))) {
        return {
          code: AppConstants.ERROR_NEW_PASSWORD_IS_NOT_AVAILABLE,
        }
      }

      const success = await editPassword(newPassword, responsable)

      if (!success) {
        internalServerError('Was not able to edit the user from the database.')
      }

      return {
        code: 'SUCCESS',
      }
    },
    requestPasswordReset: async (
      _: GraphqlRoot,
      { input }: RequestPasswordResetInput,
    ) => {
      const { email, domain } = input

      if (!(await userExist({ email }))) {
        return {
          code: AppConstants.ERROR_EMAIL_DOES_NOT_MATCH,
        }
      }

      const token = uuidv4()

      const success = await savePasswordReset(email, token)

      if (!success) {
        internalServerError(
          'Was not able to save the password reset information',
        )
      }

      const sendEmailSuccess = await sendPasswordResetEmail(
        email,
        domain,
        token,
      )

      if (!sendEmailSuccess) {
        internalServerError(
          'Was not able to send the imail with the password reset information',
        )
      }

      return {
        code: 'SUCCESS',
      }
    },
    resetPassword: async (_: GraphqlRoot, { input }: ResetPasswordInput) => {
      const { token, password } = input

      const resetPasswordData = await getResetPasswordData(token)

      if (!hasData(resetPasswordData)) {
        internalServerError('Graphql internal error')
      }

      const { tokenExpirado, responsable } =
        (resetPasswordData as ResetPasswordData) || {}

      if (tokenExpirado) {
        return {
          code: AppConstants.ERROR_EXPIRED_RESET_PASSWORD_TOKEN,
        }
      }

      if (!(await availablePassword(responsable || '', password))) {
        return {
          code: AppConstants.ERROR_NEW_PASSWORD_IS_NOT_AVAILABLE,
        }
      }

      const success = await resetPassword(password, responsable || '')

      if (!success) {
        internalServerError('Was not able to reset the user password')
      }

      return {
        code: 'SUCCESS',
      }
    },
  },
}
