// import React, { useState, useCallback } from 'react';
// import { Alert } from 'react-native';
// import { View, SafeAreaView, Text, TouchableOpacity } from 'react-native';
// import MonthPicker from 'react-native-month-year-picker';

// const MonthPickerScreen = () => {
//     const [date, setDate] = useState(new Date());
//     const [show, setShow] = useState(false);

//     const showPicker = useCallback((value) => setShow(value), []);
//     // const showPicker = useCallback((value) => alert("Hellow"), []);

//     const onValueChange = useCallback(
//         (event, newDate) => {
//             const selectedDate = newDate || date;

//             // showPicker(false);
//             setDate(selectedDate);
//         },
//         [date],
//     );

//     return (
        
//         <SafeAreaView>
//                 <TouchableOpacity onPress={() => showPicker(true)}>
//                     <Text>OPEN</Text>
//                 </TouchableOpacity>
//                 {show && (
//                     <MonthPicker
//                         onChange={onValueChange}
//                         value={date}
//                         minimumDate={new Date()}
//                         maximumDate={new Date(2025, 5)}
//                         locale="ko"
//                     />
//                 )}
//         </SafeAreaView>
//     );
// };

// export default MonthPickerScreen;


import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import moment from 'moment';
import MonthPicker from 'react-month-picker';

const styles = StyleSheet.create({
  container: {},
  input: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 0.5,
    borderRadius: 5,
    width: '100%',
    marginVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 16,
    fontWeight: '500',
  },
  contentContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 70,
  },
  confirmButton: {
    borderWidth: 0.5,
    padding: 15,
    margin: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function MonthPickerModal({ placeholder }) {
  const [isOpen, toggleOpen] = useState(false);
  const [value, onChange] = useState(null);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => toggleOpen(true)} style={styles.input}>
        <Text style={styles.inputText}>
          {value ? moment(value).format('MM/YYYY') : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={isOpen}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.contentContainer}>
          <View style={styles.content}>
            <MonthPicker
              selectedDate={value || new Date()}
              onMonthChange={onChange}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => toggleOpen(false)}>
              <Text>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

MonthPickerModal.defaultProps = {
  placeholder: 'Select date',
};

export default React.memo(MonthPickerModal);