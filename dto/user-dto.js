export const UserDto = (model) => ({
  email: model.email,
  id: model._id,
  isActivated: model.isActivated,
});
