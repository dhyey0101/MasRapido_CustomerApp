import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { renderers } from 'react-native-popup-menu';


export default class MyComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: 'first',
      setChecked: 'first'
    }
  }


  // const MyComponent = () => {
  // const [checked, setChecked] = React.useState('first');
  // const { radiobutton } = this.state;
  // var constraints = {
  //   radiobutton:{
  //             presence: {
  //               allowEmpty: false,
  //               message: "required"
  //             },
  //   }
  // };
  render() {
    const {setChecked, checked} = this.state;
    return (
      <View style={styles.radio}>
        <RadioButton style={{ borderWidth: Platform.OS === 'ios' ? '#0494cf' : '#0494cf' }}
          value="second" color='#0494cf'
          status={checked === 'first' ? 'checked' : 'unchecked'}
          // onPress={() => setChecked('first')}
          onPress={(setChecked) => this.setState(setChecked)}
        // onPress={(radiobutton)=>this.setChecked({radiobutton})}
        />
      </View>
    );
  };
}

// export default MyComponent;
const styles = StyleSheet.create({
  radio: {
    ...Platform.select({
      ios: {
        marginTop: 8,
        width: 35,
        borderWidth: 1,
        borderRadius: 35,
        height: 35,
      },
      android: {
        marginBottom: 29,
        marginTop: 5,
        // borderWidth:2,
        width: 28,
        height: 1,
        color: '#e42026',
      }
    })
  },
});