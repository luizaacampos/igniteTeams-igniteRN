import AsyncStorage from '@react-native-async-storage/async-storage';

import { getGroups } from './getGroups';

import { GROUP_COLLECTION } from '@storage/storageConfig';
import { AppError } from '@utils/AppError';

export async function groupCreate(newGroup: string) {
  try {
    const allGroups = await getGroups();

    const groupAlreadyExists = allGroups.includes(newGroup);

    if (groupAlreadyExists) {
      throw new AppError('Já existe uma turma cadastrado com esse nome.');
    }

     const storageFormatted = JSON.stringify([...allGroups, newGroup])

    await AsyncStorage.setItem(GROUP_COLLECTION, storageFormatted);
  } catch (error) {
    throw error;
  }
} 