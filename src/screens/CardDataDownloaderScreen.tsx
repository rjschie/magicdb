import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Text } from 'react-native';
import { NavStackParams } from '../App';
import Screen from '../components/Screen';
// import { BULK_DATA_DEFAULT_CARDS_URL } from '../constants/scryfall';

const CardDataDownloaderScreen = ({}: NativeStackScreenProps<
  NavStackParams,
  'CardDataDownloader'
>) => {
  // let bulkCardsUrl = '';
  try {
    // const response = await fetch(BULK_DATA_DEFAULT_CARDS_URL);
    // const json = await response.json();
    // bulkCardsUrl = json.uri;
  } catch (e) {
    console.error('Could not fetch Bulk Data Object');
  }

  try {
    //
  } catch (e) {
    //
  }

  return (
    <Screen style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is the downloader</Text>
    </Screen>
  );
};

export default CardDataDownloaderScreen;
