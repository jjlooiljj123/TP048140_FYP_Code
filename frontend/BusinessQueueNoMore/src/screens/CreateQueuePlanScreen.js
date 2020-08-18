import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import StageActivityButton from '../components/buttons/StageActivityButton';

import QueueButton from '../components/buttons/QueueButton';

import Toast from 'react-native-simple-toast';

import {connect} from 'react-redux';
import {
  queueDisciplineChanged,
  timeLimitChanged,
  maxLengthChanged,
  stageNumberChanged,
  stageNameChanged,
  stageDescriptionChanged,
  activityNameChanged,
  activityDescriptionChanged,
  activityPriorityChanged,
  waitingTimeChanged,
  addStage,
  addActivity,
  addAnotherStage,
  removeLastStage,
  createQueuePlan,
} from '../redux/action/queueStructureAction';

import {
  retrieveJWT,
  retrieveUserRole,
  retrieveUserId,
  retrieveShopId,
} from '../asyncStorage';

import {
  fetchShopId,
  updateJwt,
  updateUserRole,
  updateShopId,
  updateUserId,
} from '../redux/action/authAction';

class CreateQueuePlanScreen extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const jwt = await retrieveJWT();
    const userRole = await retrieveUserRole();
    const userId = await retrieveUserId();
    const shopId = await retrieveShopId();
    this.props.updateJwt(jwt);
    this.props.updateUserRole(userRole);
    this.props.updateUserId(userId);
    this.props.updateShopId(shopId);

    await this.props.fetchShopId(userId);

    console.log('userId', userId);
    console.log('shopId', this.props.shopId);

    await this.props.queueDisciplineChanged('FIFO');
  }

  render() {
    const stages = this.props.structures.map((stage) => (
      <View style={{marginVertical: 10}}>
        <Text style={{fontFamily: 'Montserrat-Regular'}}>
          stage: {stage.stageNumber}
        </Text>
        <Text style={{fontFamily: 'Montserrat-Regular'}}>
          name of stage: {stage.nameOfStage}
        </Text>
        <Text style={{fontFamily: 'Montserrat-Regular'}}>
          stage description:{stage.description}
        </Text>
      </View>
    ));

    const activites = this.props.stageActivities.map((activity) => (
      <View style={{marginTop: 5}}>
        <Text style={{fontFamily: 'Montserrat-Regular'}}>
          activity: {activity[0]}
        </Text>
        <Text style={{fontFamily: 'Montserrat-Regular'}}>
          activity description: {activity[1]}
        </Text>
        <Text style={{fontFamily: 'Montserrat-Regular'}}>
          priority: {activity[2]}
        </Text>
        <Text style={{fontFamily: 'Montserrat-Regular'}}>
          time to sreve: {activity[3]}
        </Text>
      </View>
    ));

    return (
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Create Your Queue Planning</Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.commonFormContainer}>
              <Text style={styles.questionText}>Queue Discipline:</Text>
              <Picker
                style={styles.questionText}
                selectedValue={this.props.queueDiscipline}
                onValueChange={(itemValue, itemIndex) =>
                  this.props.queueDisciplineChanged(itemValue)
                }>
                <Picker.Item label="First In First Out" value="FIFO" />
                <Picker.Item label="Priority Queuing" value="PQ" />
              </Picker>
              <Text style={styles.questionText}>
                Maximum Queue Length Allow:
              </Text>
              <TextInput
                style={styles.answerText}
                keyboardType="numeric"
                placeholder="999"
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="off"
                value={this.props.maxLength}
                onChangeText={(text) => this.props.maxLengthChanged(text)}
              />
              <Text style={styles.questionText}>
                Time Limit For A Customer To Show Up (min):
              </Text>
              <TextInput
                style={styles.answerText}
                keyboardType="numeric"
                placeholder="5"
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="off"
                value={this.props.timeLimit}
                onChangeText={(text) => this.props.timeLimitChanged(text)}
              />
            </View>
            <View style={styles.commonFormContainer}>
              <Text style={{fontFamily: 'Montserrat-Bold'}}>Info</Text>
              {stages}
              {activites}
            </View>
            <View style={styles.stageContainer}>
              <Text style={styles.questionText}>Stage:</Text>
              <TextInput
                style={styles.answerText}
                placeholder="1"
                keyboardType="numeric"
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="off"
                value={this.props.stageNumber}
                onChangeText={(text) => this.props.stageNumberChanged(text)}
              />
              <Text style={styles.questionText}>Stage Name:</Text>
              <TextInput
                style={styles.answerText}
                placeholder="queue"
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="off"
                value={this.props.stageName}
                onChangeText={(text) => this.props.stageNameChanged(text)}
              />
              <Text style={styles.questionText}>Stage Description:</Text>
              <TextInput
                style={styles.answerText}
                placeholder="queue for ordering"
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="off"
                value={this.props.stageDescription}
                onChangeText={(text) =>
                  this.props.stageDescriptionChanged(text)
                }
              />
              <View style={styles.activityButtonContainer}>
                <StageActivityButton
                  text="Add Stage"
                  onPress={() => {
                    // console.log(
                    //   'structuresArray outside',
                    //   this.props.structures,
                    // );

                    this.props.addStage({
                      structuresArray: this.props.structures,
                      stageNumber: this.props.stageNumber,
                      nameOfStage: this.props.stageName,
                      description: this.props.stageDescription,
                    });
                  }}
                />
              </View>

              <View style={styles.activityContainer}>
                <Text style={styles.questionText}>Activity Name:</Text>
                <TextInput
                  style={styles.answerText}
                  placeholder="Dine In"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoCompleteType="off"
                  value={this.props.activityName}
                  onChangeText={(text) => this.props.activityNameChanged(text)}
                />
                <Text style={styles.questionText}>Activity Description:</Text>
                <TextInput
                  style={styles.answerText}
                  placeholder="Eat Inside"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoCompleteType="off"
                  value={this.props.ActivityDescription}
                  onChangeText={(text) =>
                    this.props.activityDescriptionChanged(text)
                  }
                />
                <Text style={styles.questionText}>Activity Priority:</Text>
                <TextInput
                  style={styles.answerText}
                  placeholder="1"
                  keyboardType="numeric"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoCompleteType="off"
                  value={this.props.activityPriority}
                  onChangeText={(text) =>
                    this.props.activityPriorityChanged(text)
                  }
                />
                <Text style={styles.questionText}>
                  Default time to serve this activity (min):
                </Text>
                <TextInput
                  style={styles.answerText}
                  placeholder="10"
                  keyboardType="numeric"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoCompleteType="off"
                  value={this.props.waitingTime}
                  onChangeText={(text) => this.props.waitingTimeChanged(text)}
                />
              </View>

              <View style={styles.activityButtonContainer}>
                <StageActivityButton
                  text="Add Shop Activity"
                  onPress={() =>
                    this.props.addActivity({
                      stageActivities: this.props.stageActivities,
                      activityName: this.props.activityName,
                      ActivityDescription: this.props.ActivityDescription,
                      activityPriority: this.props.activityPriority,
                      waitingTime: this.props.waitingTime,
                    })
                  }
                />
              </View>
            </View>
            <View style={styles.smallButtonContainer}>
              <StageActivityButton
                text="Add Another Stage"
                onPress={() =>
                  this.props.addAnotherStage({
                    shopActivities: this.props.shopActivities,
                    stageActivities: this.props.stageActivities,
                  })
                }
              />
              <StageActivityButton
                text="Remove last stage"
                onPress={() => {
                  this.props.removeLastStage({
                    structuresArray: this.props.structures,
                    shopActivities: this.props.shopActivities,
                  });
                }}
              />
            </View>
          </View>
          <View style={styles.submitButtonConatiner}>
            <QueueButton
              text="Submit"
              onPress={() => {
                if (
                  this.props.structures.length == 0 ||
                  (this.props.stageActivities.length == 0 &&
                    this.props.structures.length == 0)
                ) {
                  Toast.show('Please fill in at least 1 stage and 1 activity');
                } else {
                  this.props.createQueuePlan({
                    shopId: this.props.shopId,
                    structures: this.props.structures,
                    shopActivities: this.props.shopActivities,
                    stageActivities: this.props.stageActivities,
                    queueDiscipline: this.props.queueDiscipline,
                    maxQueueLength: this.props.maxLength,
                    timeLimitForCustomer: this.props.timeLimit,
                  });
                }
              }}
            />
            <Text style={styles.errorText}>
              {this.props.creatingQueuePlanError}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    // alignItems: 'center',
    marginHorizontal: 20,
  },
  titleContainer: {
    // alignSelf: 'flex-start',
    marginTop: 15,
  },
  titleText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: '#8E54E9',
  },
  contentContainer: {
    marginVertical: 0,
    alignSelf: 'stretch',
  },
  commonFormContainer: {
    // borderWidth: 1,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 1,
    shadowOpacity: 1,
    padding: 5,
  },
  questionText: {
    fontFamily: 'Montserrat-Light',
    fontSize: 14,
    marginVertical: 3,
    marginLeft: 15,
  },
  answerText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    // borderWidth: 1,
    height: 40,
    // backgroundColor: 'rgba(255,255,255,0.4)', // 40% opaque
    backgroundColor: 'rgba(0,0,0,0.1)', // 40% opaque
    borderRadius: 40,
    paddingHorizontal: 15,
    marginTop: 1,
  },
  stageContainer: {
    // borderWidth: 2,
    marginVertical: 10,
    elevation: 1,
    borderRadius: 10,
    padding: 5,
  },
  activityContainer: {
    // borderWidth: 1,
    // borderColor: 'red',
  },
  activityButtonContainer: {
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  smallButtonContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    // marginVertical: 5,
  },
  submitButtonConatiner: {
    marginVertical: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'Montserrat-Italic',
    marginBottom: 10,
    marginLeft: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    isCreating: state.queueStructure.isCreating,
    queueDiscipline: state.queueStructure.queueDiscipline,
    timeLimit: state.queueStructure.timeLimit,
    maxLength: state.queueStructure.maxLength,
    stageNumber: state.queueStructure.stageNumber,
    stageName: state.queueStructure.stageName,
    stageDescription: state.queueStructure.stageDescription,
    activityName: state.queueStructure.activityName,
    ActivityDescription: state.queueStructure.ActivityDescription,
    activityPriority: state.queueStructure.activityPriority,
    waitingTime: state.queueStructure.waitingTime,
    structures: state.queueStructure.structures,
    stageActivities: state.queueStructure.stageActivities,
    shopActivities: state.queueStructure.shopActivities,
    shopId: state.auth.shopId,
    jwt: state.auth.jwt,
    creatingQueuePlanError: state.queueStructure.creatingQueuePlanError,
  };
};

export default connect(mapStateToProps, {
  queueDisciplineChanged,
  timeLimitChanged,
  maxLengthChanged,
  stageNumberChanged,
  stageNameChanged,
  stageDescriptionChanged,
  activityNameChanged,
  activityDescriptionChanged,
  activityPriorityChanged,
  waitingTimeChanged,
  addStage,
  addActivity,
  addAnotherStage,
  removeLastStage,
  createQueuePlan,
  fetchShopId,
  updateJwt,
  updateUserRole,
  updateShopId,
  updateUserId,
})(CreateQueuePlanScreen);

// export default CreateQueuePlanScreen;
