'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} = React;

var request = require('superagent');

var _ = require('lodash');
var moment = require('moment');

var url = 'https://<YOUR FIREBASE>.firebaseio.com/events.json'

var event = React.createClass({
  getUrl: function() {
    return url;
  },
  getTodaysEventsUrl: function() {
    var today = moment().format('MM-DD-YYYY');
    return this.getUrl() + '?orderBy="day"&startAt="' + today + '"&endAt="' + today + '"';
  },
  getMostRecentUrl: function() {
    return this.getUrl() + '?orderBy="timestamp"&limitToFirst=1';
  },
  handleEvent: function(e) {
    e.preventDefault();

    var currentdate = new moment();

    var event = {
                    timestamp: currentdate,
                    day: currentdate.format('MM-DD-YYYY')
                  };

    request
    .post(this.getTodaysEventsUrl())
    .send(event)
    .type('json')
    .end(function(err, res){
      console.log(res);
        //TODO: add to state
    });
  },
  getEventsToday: function () {
    return this.state.events ? Object.keys(this.state.events).length : 0;
  },
  getLastEventsTime: function () {
    return moment(this.state.mostRecent).format("h:mm a");
  },
  componentWillMount: function() {
    request
    .get(this.getUrl())
    .accept('application/json')
    .end(function(err, res){
      var events = JSON.parse(res.text);

      this.setState({events: events, mostRecent: this.state.mostRecent});
    }.bind(this));

    request
    .get(this.getMostRecentUrl())
    .accept('application/json')
    .end(function(err, res){
      var mostRecent = JSON.parse(res.text);
      console.log(mostRecent);
      this.setState({events: this.state.events, mostRecent: mostRecent.timestamp});
    }.bind(this));
  },
  getInitialState: function() {
    return {events: {mostRecent: ''}};
  },
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusHeader}>
            Status
          </Text>
          <Text style={styles.status}>
            The event has occured {this.getEventsToday()} times today.
          </Text>
          <Text style={styles.status}>
            The event last occured at: {this.getLastEventsTime()}
          </Text>
        </View>
        <View style={styles.eventsContainer}>
          <Text style={styles.eventHeader}>
            Events
          </Text>
          <TouchableOpacity onPress={this.handleEvent}>
            <Text style={styles.event}>
              Log Event
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  statusHeader: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  status: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  eventContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  eventHeader: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  event: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  }
});

AppRegistry.registerComponent('event', () => event);
