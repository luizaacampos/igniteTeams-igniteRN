import AsyncStorage from '@react-native-async-storage/async-storage';

import { PLAYER_COLLECTION } from '@storage/storageConfig';
import { AppError } from '@utils/AppError';
import { getPlayersByGroup } from './getPlayersByGroup';

import { PlayerStorageDTO } from './playerStorageDTO';

export async function addPlayerByGroup(newPlayer: PlayerStorageDTO, group: string) {
  try {
    const storagePlayers = await getPlayersByGroup(group);

    const playerAlreadyOnGroup = storagePlayers.filter(player => player.name === newPlayer.name);

    if (playerAlreadyOnGroup.length > 0) {
      throw new AppError('Essa turma já possui um jogador com esse nome.')
    }

    const playersFormatted = JSON.stringify([...storagePlayers, newPlayer]);

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, playersFormatted);
  } catch (error) {
    throw(error);
  }
}