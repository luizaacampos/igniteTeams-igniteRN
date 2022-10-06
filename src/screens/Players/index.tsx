import { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Loading } from '@components/Loading';
import { ButtonIcon } from '@components/ButtonIcon';
import { Filter } from '@components/Filter';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Input } from '@components/Input';
import { PlayerCard } from '@components/PlayerCard';
import { EmptyList } from '@components/EmptyList';
import { Button } from '@components/Button';

import { AppError } from '@utils/AppError';

import { addPlayerByGroup } from '@storage/player/addPlayerByGroup';
import { getPlayersByGroupAndTeam } from '@storage/player/getPlayersByGroupAndTeam';
import { PlayerStorageDTO } from '@storage/player/playerStorageDTO';
import { removePlayerByGroup } from '@storage/player/removePlayerByGroup';
import { removeGroupByName } from '@storage/group/removeGroupByName';

import { Container, Form, HeaderList, NumberOfPlayers } from './styles';

type RouteParams = {
  group: string;
}

export function Players() {
  const route = useRoute();
  const { group } = route.params as RouteParams;

  const newPlayerNameInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [team, setTeam] = useState('Time A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

 async function handleAddNewPlayer() {
  if (newPlayerName.trim().length === 0) {
    return Alert.alert('Novo jogador', 'Informe o nome do novo jogador.')
  }

  const newPlayer = {
    name: newPlayerName,
    team
  }

  try {
    await addPlayerByGroup(newPlayer, group);

    newPlayerNameInputRef.current?.blur();

    setNewPlayerName('');
    fetchPlayersByTeam();
    
  } catch (error) {
    if(error instanceof AppError) {
      Alert.alert('Novo jogador', error.message);
    } else {
      console.log(error);
      Alert.alert('Novo jogador', 'Erro ao adicionar um novo jogador.');
    }
  }

 }

 async function fetchPlayersByTeam() {
    try {
      setIsLoading(true);
      const playersByTeam = await getPlayersByGroupAndTeam(group, team);
      setPlayers(playersByTeam);
    } catch (error) {
      console.log(error);
      Alert.alert('Jogadores', 'Não foi possível carregar os jogadores desse time.');
    } finally {
      setIsLoading(false);
    }
 }

 async function handleRemovePlayer(playerName: string) {
  try {
    await removePlayerByGroup(playerName, group);
    fetchPlayersByTeam();
  } catch (error) {
    Alert.alert('Remover jogador', 'Não foi possível remover o jogador da turma.');
  }
 }

 async function removeGroup() {
  try {
    await removeGroupByName(group);
    navigation.navigate('groups');

  } catch (error) {
    console.log(error);
    Alert.alert('Remover turma', 'Não foi possível remover essa turma');
  }
 }

 async function handleRemoveGroup() {
  Alert.alert(
    'Remover turma', 
    'Tem certeza que deseja remover essa turma?', 
    [
      { text: 'Não', style: 'cancel' },
      { text: 'Sim', onPress: () => removeGroup() }
    ]
  )
  
 } 

 useEffect(() => {
  fetchPlayersByTeam();
 }, [team])

  return (
    <Container>
      <Header showBackButton/>
      <Highlight 
        title={group} 
        subtitle='Adicione a galera e separe os times' 
      />

      <Form>
        <Input
          placeholder='Nome do jogador'
          autoCorrect={false}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          inputRef={newPlayerNameInputRef}
          onSubmitEditing={handleAddNewPlayer}
          returnKeyType="done"
        />
        <ButtonIcon
          icon="add"
          onPress={handleAddNewPlayer}
        />
      </Form>

      <HeaderList>
        <FlatList
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter 
              title={item} 
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />
        <NumberOfPlayers>
            {players.length}
        </NumberOfPlayers>
      </HeaderList>

      {isLoading ? <Loading /> : (
        <FlatList
          data={players}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <PlayerCard name={item.name} onRemove={() => {handleRemovePlayer(item.name)}} />
          )}
          ListEmptyComponent={() => (
            <EmptyList message='Não há pessoas nesse time' />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            players.length === 0 && { flex: 1 }
          ]}
        />
      )}
     

      <Button title='Remover turma' type='SECONDARY' onPress={handleRemoveGroup} />
    </Container>
  )
}
