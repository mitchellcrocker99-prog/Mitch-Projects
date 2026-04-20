import React from 'react';
import { Text, View, FlatList, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';
 
const styles = StyleSheet.create({
container: {
  flex: 1,
  paddingTop: 5,
  flexDirection: "column",
  fontSize: 40,
 },
 item: {
   padding: 0,
   fontSize: 20,
   height: 44,
   fontWeight: 'bold',
   backgroundColor: '#E8EAED',
   alignItems: 'center',
   borderRadius: 10,
 },

 
 list: {
  flex: 1,
  paddingTop: 25,
  paddingLeft: 15,
  justifyContent: 'top',
  borderWidth: 5,
  fontSize: 22,
  backgroundColor: '#f4f4f4',
  },
 title: {
   fontSize: 40,
 },
 
});
const trailList = [
 {key: '1', name: 'Alice Lake', image: 'https://nomanbefore.com/wp-content/uploads/2019/10/Alice_Lake_Idaho-6519.jpg',selected :false, time: '2hr', elevation: '500ft' },
 {key: '2', name: 'Palisades Creek Trail', image: 'https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5279329.jpg',selected :false, time: '4hr', elevation: '2ft'},
{key: '3', name: 'Table Rock Trail', image: 'https://www.outdoorproject.com/sites/default/files/styles/hero_image_desktop/public/features/dsc_0007_-_5_of_51.jpg?itok=R5_4I5Zl',selected :false, time: '2hr', elevation: '879ft'},
{key: '4', name: 'Freddy\'s Stack Rock Trail', image: 'https://miro.medium.com/max/1400/1*2fWLL2Mqfg7BaNCmQTT4ig.jpeg',selected :false, time: '4hr 45min', elevation: '1351ft'},
{key: '5', name: 'Cervidae Peak', image: 'https://www.outdoorproject.com/sites/default/files/styles/hero_image_desktop_2x/public/1603954218/img_1634.jpg?itok=k2rs60tj',selected :false, time: '3hr 15min', elevation: '1883ft'},
{key: '6', name: 'Hulls Gulch Nature Trail', image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/01/00/9b/33/caption.jpg?w=1200&h=-1&s=1',selected :false, time: '2hr 59min', elevation: '1131ft'},
{key: '7', name: 'Adelmann Mine', image: 'https://www.onlyinyourstate.com/wp-content/uploads/2021/10/Adelmann-Mine.jpeg',selected :false, time: '2hr 44min', elevation: '1322ft'},
{key: '8', name: 'Red Cliffs Nature Center Trail', image: 'https://boisetrails.com/wp-content/uploads/2017/12/Red-Cliffs-Photo-Nov-25-8-16-55-AM-1600x1200.jpg',selected :false, time: '1hr 22min', elevation: '482ft'},
{key: '9', name: 'Mores Mountain Loop', image: 'https://www.fs.usda.gov/wildflowers/regions/intermountain/MoresMountain/images/trailheadMoresMtn_lg.jpg',selected :false, time: '1hr 8min', elevation: '511ft'},
{key: '10', name: 'Polecat Loop Trail', image: 'https://miro.medium.com/max/1400/1*FvU1HYpUmObVv9MuQxY1Dg.jpeg',selected :false, time: '2hr 30min', elevation: '74ft'},
{key: '11', name: 'Boise River Greenbelt Trail', image: 'https://www.weknowboise.com/uploads/shared/images/Blog/garden-city-greenbelt-bridge.jpg',selected :false, time: '2hr 57min', elevation: '91ft'},
{key: '12', name: 'Seamans Gulch', image: 'https://cdn2.apstatic.com/photos/mtb/7026721_medium_1555005002.jpg',selected :false, time: '52min', elevation: '255ft'},
{key: '13', name: 'Shafer Butte Loop', image: 'https://www.idahoconservation.org/wp-content/uploads/2020/06/18721833316_163f8ea88f_o.jpg',selected :false, time: '2hr 32min', elevation: '997ft'},
{key: '14', name: 'Kepros Mountain Trail', image: 'https://3.bp.blogspot.com/-hEomO-YPXyo/WN2vaoSq00I/AAAAAAAAFSE/wwJvWqGLltc5MZjSKBQuJ8R7sGwUpcjvQCLcB/s1600/IMG_3417.JPG',selected :false, time: '4hr 46min', elevation: '1988ft'},
{key: '15', name: 'Camels Back Loop', image: 'https://i.ytimg.com/vi/60o46qLltuQ/maxresdefault.jpg',selected :false, time: '46min', elevation: '311ft'},
];
 
 
function Item({ title, info, onPress }) {
 const backgroundColor = trailList.selected ? 'black' : 'white';
const color = trailList.selected ? 'white' : 'black';
return (
  <TouchableOpacity onPress={onPress}>
    <View>
      <Text
       backgroundColor={{ backgroundColor }}
       textColor={{ color }}>{title}</Text>
    </View>
  </TouchableOpacity>
);
}
export default function App() {
const [selected, setSelected] = React.useState(null);
 
return (
  
  <View style={styles.container}>
    <FlatList  style={styles.list}
      data={trailList}
      renderItem={({ item }) => (
        <Item
          title={item.name}
          info={item.image}
          onPress={() => setSelected(item.key)}
        />
      )}
      keyExtractor={item => item.key}
    />
    {selected && (
      <View  style={styles.list}>
        <Text style={styles.item}>Time to Complete: {trailList.find(item => item.key === selected).time}</Text>
        <Text style={styles.item}>Elevation Change: {trailList.find(item => item.key === selected).elevation}</Text>
        <Image
              style={{width: '95%', height:250}}
              source={{ uri: trailList.find(item => item.key === selected).image }}
         />
         <Text style={styles.item}>{trailList.find(item => item.key === selected).name}</Text>
      </View>
   
    )}
  </View>
);
}
