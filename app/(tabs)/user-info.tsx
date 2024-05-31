import React from 'react';
import { View, Dimensions, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { loadFonts } from '@/components/Fonts';

type UserInfoProps = {
  name: string;
  email: string;
  profilePicture: string;
}

const screenWidth = Dimensions.get('screen').width;

export default function UserInfoScreen() {
  const fontsLoaded = loadFonts();
  const userData:UserInfoProps = {
    name: 'Duc Thien',
    email: 'huynhducthien41906@gmail.com',
    profilePicture: 'https://drive.google.com/thumbnail?id=1G3Wu0VyYEZHWueHvCAaAQVBSXZmOO0FN',
  };
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Image source={require('@/assets/images/user-background.png')} style={styles.headerImage} />}
    >
    <View>
      <Image source={require('@/assets/images/profile-picture.jpeg')} style={styles.avatarFrame}/>
      <Text style={styles.userName}>{userData.name}</Text>
      <Text style={styles.userEmail}>{userData.email}</Text>
    </View>
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  avatarFrame: {
    alignSelf: 'center',
    height: screenWidth * 0.4,
    width: screenWidth * 0.4,
    borderWidth: 3,
    borderRadius: screenWidth * 0.4,
    borderColor: 'grey',
    resizeMode: 'contain',
  },
  userName: {
    fontFamily: 'Dosis-Bold',
    fontSize: 35,
    alignSelf: 'center'
  }, 
  userEmail: {
    fontFamily: 'Dosis-Regular',
    fontSize: 15,
    alignSelf: 'center',
    color: 'grey'
  }
});
