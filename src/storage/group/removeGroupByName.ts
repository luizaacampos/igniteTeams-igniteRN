import AsyncStorage from '@react-native-async-storage/async-storage';
import { GROUP_COLLECTION, PLAYER_COLLECTION } from '@storage/storageConfig';
import { getGroups } from './getGroups';

export async function removeGroupByName(groupToBeRemoved: string) {
  try {
    const allGroups = await getGroups();

    const filteredGroups = allGroups.filter(group => group !== groupToBeRemoved);

    await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(filteredGroups));
    await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${groupToBeRemoved}`);

  } catch (error) {
    throw error;
  }
}