import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { addStaff, getProfileAPI, getStaffs, setRoleAPI, updateProfile, updateStaff } from '../apis/account';
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
      return data?.data || [];
    },
    refetchOnWindowFocus: true,
    staleTime: 6000000,
    enabled: Utils.isAuthenticated(),
  });
};

export const useGetProfile = () =>
{
  const { setMyProfile } = useAccountStore();
  return useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => {
      const { data } = await getProfileAPI();
      const myProfile = data?.data || {};
      setMyProfile(myProfile);
      return myProfile;
    },
    refetchOnWindowFocus: true,
    staleTime: 6000000,
    enabled: Utils.isAuthenticated(),
  });
};

// update my profile
export const useUpdateProfile = () => {
  const { refetch } = useGetProfile();
  return useMutation({
    mutationFn: async (payload) => {
      return updateProfile(payload);
    },
    onSettled: (res) => {
      if (res && res.status === 200)
      {
        refetch();
        toast.success(res.data.message, {
          position: 'top-right'
        });
      } else {
        toast.error(res?.message ?? 'Something went wrong', {
          position: 'top-right'
        });
      }
    }
  });
};

export const useSetRole = () => {
  const { refetch } = useGetStaffs();
  const { toggleRoleForm, selectedStaffId: id } = useAccountStore();
  return useMutation({
    mutationFn: async (payload) =>
    {
      if (!id) return
      return setRoleAPI(id, payload);
    },
    onSettled: (res) => {
      if (res && res.status === 200)
      {
        refetch();
        toast.success(res.data.message, {
          position: 'top-right'
        });
        toggleRoleForm();
      } else {
        toast.error(res?.message ?? 'Something went wrong', {
          position: 'top-right'
        });
      }
    }
  });
};
