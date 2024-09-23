// LoadingModal.tsx
import React from 'react';
import { Modal, View, Image, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("screen");

interface LoadingModalProps {
  isVisible: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isVisible }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.loadingBox}>
          <Image
            source={require('../assets/gif/cute_loading.gif')}
            style={styles.loadingImage}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingBox: {
    width: width * 0.8,
    height: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#a6ba9e',
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#8f9779',
    padding: 20,
  },
  loadingImage: {
    width: '200%',
    height: '200%',
    resizeMode: 'contain',
  },
});

export default LoadingModal;
