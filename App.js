import { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, ActivityIndicator, StatusBar, Image, Alert } from 'react-native';

export default function App() {
  const [keyword, setKeyword] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const keywordRef = useRef(null);

  const fetchRepositories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${keyword}`)
      const data = await response.json();
      if (data.meals) {
        setRepositories(data.meals);
        setLoading(false);
      } else {
        Alert.alert('Error', 'No recipes found');
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
    } finally {
      keywordRef.current.blur();
      setLoading(false);
    }
  }

  const listDivider = () => {
    return (
      <View
      style={{
        height: 1,
        width: "90%",
        backgroundColor: "gray",
      }}
      />
    );
  };

  if(loading) {
    return(
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  } 
  else {
      return (
      <View style={styles.container}>
          <StatusBar hidden={true} />
          <FlatList 
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => 
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold"}}>{item.strMeal}</Text>
            <Image
              source={{ url: item.strMealThumb }}
              style= {{ width: 100, height: 100 }}
            />
        </View>
          }
          data={repositories}
          ItemSeparatorComponent={listDivider} />
        <View style={styles.fetch}>
          <TextInput
            ref={keywordRef}
            style={{ fontSize: 20, width: 200 }}
            placeholder='Type a keyword'
            value={keyword}
            onChangeText={text => setKeyword(text)}
          />
          <Button title="Find" onPress={fetchRepositories} />
        </View>    
      </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: '5%',
    marginTop: 50,
  },
  fetch: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loading: {
    marginTop: 400,
  }
});



