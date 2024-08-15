import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { addStaff, getStaffs, updateStaff } from '../apis/account';
import Utils from '../shared/localStorage';
import useAccountStore from '../stores/AccountStore';
import toast from 'react-hot-toast';

export const useAccountData = () => {
  return useQuery(['account'], async () => {
    const { data } = await axios.get('/api/accounts');
    return data;
  });
};

export const useCreateAccount = () => {
  const {toggleAccountForm } = useAccountStore();
  
  const { refetch } = useGetStaffs();
  return useMutation({
    mutationFn: async (payload) => {
      return addStaff(payload);
    },
    onSettled: (res) => {
      console.log({ res })
      if (res && res.status === 201)
      {
        refetch();
        toast.success(res.data.message, {
          position: 'top-right'
        });
        toggleAccountForm();
      } else {
        toast.error(res?.message ?? 'Something went wrong', {
          position: 'top-right'
        });
      }
    }
  });
};

export const useUpdateAccount = () => {
  const {toggleAccountForm } = useAccountStore();
  
  const { refetch } = useGetStaffs();
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      return updateStaff(id, payload);
    },
    onSettled: (res) => {
      if (res && res.status === 200)
      {
        refetch();
        toast.success(res.data.message, {
          position: 'top-right'
        });
        toggleAccountForm();
      } else {
        toast.error(res?.message ?? 'Something went wrong', {
          position: 'top-right'
        });
      }
    }
  });
};

export const useGetStaffs = () => {
  return useQuery({
    queryKey: ['staffs'],
    queryFn: async () => {
      const { data } = await getStaffs();
      console.log({ data });
      return data?.data || [];
    },
    refetchOnWindowFocus: true,
    staleTime: 6000000,
    enabled: Utils.isAuthenticated(),
  });
};