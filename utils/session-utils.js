import { UserDto } from '../dto/user-dto.js';
import tokenService from '../service/token-service.js';

export const createUserSession = async (user) => {
  const userDto = UserDto(user);
  const tokens = tokenService.generateToken({ ...userDto });

  await tokenService.saveToken(userDto.id, tokens.refreshToken);

  return { ...tokens, user: userDto };
};
