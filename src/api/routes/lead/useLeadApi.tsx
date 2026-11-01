import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LeadApi } from "./leadApi";
import { CreateLeadRequest, GetLeadsParams, UpdateLeadRequest } from "./leadModels";

export const leadQueryKey = ["lead"] as const;

export function useLeadApi() {
    const leadApi = new LeadApi();
    const queryClient = useQueryClient();

    const GetLeads = (params?: GetLeadsParams, options?: { enabled?: boolean }) => {
        return useQuery({
            queryKey: [...leadQueryKey, "list", params],
            enabled: options?.enabled ?? true,
            placeholderData: keepPreviousData,
            queryFn: async () => (await leadApi.getLeads(params)).data,
        });
    }

    const GetLeadById = (id: string) => {
        return useQuery({
            queryKey: [...leadQueryKey, "byId", id],
            enabled: !!id,
            queryFn: async () => (await leadApi.getLeadById(id)).data,
        });
    }

    const CreateLead = () => {
        return useMutation({
            mutationFn: async (request: CreateLeadRequest) => (await leadApi.createLead(request)).data,
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: leadQueryKey });
            },
        });
    }

    const UpdateLead = () => {
        return useMutation({
            mutationFn: async ({ id, ...request }: UpdateLeadRequest & { id: string }) =>
                (await leadApi.updateLead(id, request)).data,
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: leadQueryKey });
            },
        });
    }

    const DeleteLead = () => {
        return useMutation({
            mutationFn: (id: string) => leadApi.deleteLead(id),
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: leadQueryKey });
            },
        });
    }

    return { GetLeads, GetLeadById, CreateLead, UpdateLead, DeleteLead };
}
