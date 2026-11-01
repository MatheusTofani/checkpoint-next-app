import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PurchaseApi } from "./purchaseApi";
import { CreatePurchaseRequest, GetPurchasesParams, UpdatePurchaseRequest } from "./purchaseModels";

export const purchaseQueryKey = ["purchase"] as const;

export function usePurchaseApi() {
    const purchaseApi = new PurchaseApi();
    const queryClient = useQueryClient();

    const GetPurchases = (params?: GetPurchasesParams, options?: { enabled?: boolean }) => {
        return useQuery({
            queryKey: [...purchaseQueryKey, "list", params],
            enabled: options?.enabled ?? true,
            placeholderData: keepPreviousData,
            queryFn: async () => (await purchaseApi.getPurchases(params)).data,
        });
    }

    const GetPurchaseById = (id: string) => {
        return useQuery({
            queryKey: [...purchaseQueryKey, "byId", id],
            enabled: !!id,
            queryFn: async () => (await purchaseApi.getPurchaseById(id)).data,
        });
    }

    const CreatePurchase = () => {
        return useMutation({
            mutationFn: async (request: CreatePurchaseRequest) => (await purchaseApi.createPurchase(request)).data,
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: purchaseQueryKey });
            },
        });
    }

    const UpdatePurchase = () => {
        return useMutation({
            mutationFn: async ({ id, ...request }: UpdatePurchaseRequest & { id: string }) =>
                (await purchaseApi.updatePurchase(id, request)).data,
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: purchaseQueryKey });
            },
        });
    }

    const DeletePurchase = () => {
        return useMutation({
            mutationFn: (id: string) => purchaseApi.deletePurchase(id),
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: purchaseQueryKey });
            },
        });
    }

    return { GetPurchases, GetPurchaseById, CreatePurchase, UpdatePurchase, DeletePurchase };
}
