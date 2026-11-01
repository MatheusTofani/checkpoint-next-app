import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductApi } from "./productApi";
import { CreateProductRequest, GetProductsParams } from "./productModels";

export const productQueryKey = ["product"] as const;

export function useProductApi() {
    const productApi = new ProductApi();
    const queryClient = useQueryClient();

    const GetProducts = (params?: GetProductsParams, options?: { enabled?: boolean }) => {
        return useQuery({
            queryKey: [...productQueryKey, "list", params],
            enabled: options?.enabled ?? true,
            placeholderData: keepPreviousData,
            queryFn: async () => (await productApi.getProducts(params)).data,
        });
    }

    const GetProductById = (id: string) => {
        return useQuery({
            queryKey: [...productQueryKey, "byId", id],
            enabled: !!id,
            queryFn: async () => (await productApi.getProductById(id)).data,
        });
    }

    const CreateProduct = () => {
        return useMutation({
            mutationFn: async (request: CreateProductRequest) => (await productApi.createProduct(request)).data,
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: productQueryKey });
            },
        });
    }

    const UploadProductImage = () => {
        return useMutation({
            mutationFn: async ({ id, image }: { id: string; image: File }) => (await productApi.uploadProductImage(id, image)).data,
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: productQueryKey });
            },
        });
    }

    const DeleteProduct = () => {
        return useMutation({
            mutationFn: (id: string) => productApi.deleteProduct(id),
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: productQueryKey });
            },
        });
    }

    return { GetProducts, GetProductById, CreateProduct, UploadProductImage, DeleteProduct };
}
