import { useMutation } from "@tanstack/react-query";
import { UserApi } from "./userApi";
import { CreateUserRequest } from "./userModels";

export function useUserApi() {
    const userApi = new UserApi();

    const CreateUser = () => {
        return useMutation({
            mutationFn: async (request: CreateUserRequest) => (await userApi.createUser(request)).data,
        });
    }

    return { CreateUser };
}
