import {
    Linking,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
  } from 'react-native';
  import React from 'react';
  
const tagRegex = /[\#][a-zA-Z0-9_.]+/;
const atRegex = /[\@][a-z0-9_.]+/;
const urlRegex =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

const regex = new RegExp(
  urlRegex.source + '|' + tagRegex.source + '|' + atRegex.source,
  'g',
);
const AnonimoText = (props: AnonimoTextProp) => {
  let list: TextProp[] = [];
  let main = props.text;
  let matches = main.match(regex);

  matches?.forEach(item => {
    let splits = main.split(item);

    list.push({
      text: splits[0],
      isHyper: false,
      onAction: undefined,
    });
    if (item.match(urlRegex)) {
      list.push({
        text: item,
        isHyper: true,
        onAction: () => Linking.openURL(item),
      });
    } else if (item.match(tagRegex)) {
      list.push({
        text: item,
        isHyper: true,
        onAction: () => {}, // TODO - will call hashtag page
      });
    } else if (item.match(atRegex)) {
      list.push({
        text: item,
        isHyper: true,
        onAction: () => {
          let profileScreenParam: ProfileScreenParam = {
            username: item,
          };
          navigate({
            name: ScreenRoute.profileScreen,
            params: profileScreenParam,
          });
        },
      });
    }
    main = splits[splits.length - 1];
  });

  if (list.length === 0) {
    list.push({
      text: main,
      isHyper: false,
      onAction: undefined,
    });
  }

  let textViews = list.map(m => {
    let style = m.isHyper ? styles.hyper : undefined;

    return (
      <Text
        key={Math.random()}
        style={style}
        onPress={() => {
          if (m.onAction) {
            m.onAction();
          }
        }}>
        {m.text}
      </Text>
    );
  });
  return (
    <View style={props.viewStyle}>
      <Text style={props.style}>{textViews}</Text>
    </View>
  );
};

export default HyperText;

type HyperTextProp = {
  text: string;
  style: TextStyle[];
  viewStyle?: ViewStyle | ViewStyle[];
};

enum HyperTextType {
  LINK = 'http',
  TAG = '#',
  AT = '@',
}

type TextProp = {
  text: string;
  isHyper: boolean;
  onAction: (() => void) | undefined;
};

const styles = StyleSheet.create({
  hyper: {
    color: '#0090E1',
  },
});