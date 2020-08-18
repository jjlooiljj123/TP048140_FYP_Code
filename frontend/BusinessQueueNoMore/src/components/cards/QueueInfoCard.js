import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

const QueueInfoCard = ({
  queueStatus,
  queueNumber,
  queueLength,
  queueStage,
  activity,
  description,
}) => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.queueStatusText}>{queueStatus}</Text>
      <Text style={styles.queueNumberText}>No. {queueNumber}</Text>
      <Text style={styles.waitingLengthText}>Length: {queueLength}</Text>
      <Text style={styles.activityDescriptionQuestion}>
        Stage: {queueStage}
      </Text>
      <Text style={styles.activityDescriptionQuestion}>
        Activity: {activity}
      </Text>
      <Text line={3} style={styles.activityDescriptionQuestion}>
        Description: {description}
      </Text>
      {/* <Text style={styles.queueStatusText}>Queuing</Text>
        <Text style={styles.queueNumberText}>No. 00001</Text>
        <Text style={styles.waitingLengthText}>Length: 1</Text>
        <Text style={styles.activityDescriptionQuestion}>Stage: 1</Text>
        <Text style={styles.activityDescriptionQuestion}>
          Activity: Dine In
        </Text>
        <Text line={3} style={styles.activityDescriptionQuestion}>
          Description: -
        </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    elevation: 1,
    paddingVertical: 10,
  },
  queueStatusText: {
    fontFamily: 'Montserrat-BoldItalic',
    fontSize: 24,
  },
  queueNumberText: {
    fontFamily: 'Montserrat-SemiBoldItalic',
    fontSize: 22,
    marginTop: 10,
  },
  waitingLengthText: {
    fontFamily: 'Montserrat-SemiBoldItalic',
    fontSize: 20,
    marginTop: 10,
  },
  activityDescriptionQuestion: {
    fontFamily: 'Montserrat-Italic',
    fontSize: 18,
    marginTop: 10,
  },
  activityDescriptionText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    marginTop: 5,
  },
});

export default QueueInfoCard;
