import React,{Component} from 'react'
import {View,Text,TouchableOpacity,FlatList,ScrollView,TextInput} from 'react-native'
import db from '../config'
export default class BookSearchScreen extends Component{
    constructor(){
        super()
        this.state={
           allTransactions:[], 
           search:'',
           lastVisibleTransaction:[]
        }
    }
    searchTransaction=async(Text)=>{
        var enteredText=Text.split('')
        var text=text.toUpperCase()
        if(enteredText[0].toUpperCase()==='B'){
            const transaction=await db.collection('Transactions').where('BookID','==',text).get()
            query.docs.map(doc=>{
                this.setState({
                    allTransactions:[...this.state.allTransactions,doc.data()],
                    lastVisibleTransaction:doc
                }) 
             })
        }
        else if(enteredText[0].toUpperCase()==='S'){
            const transaction=await db.collection('Transactions').where('studentID','==',text).get()
            query.docs.map(doc=>{
                this.setState({
                    allTransactions:[...this.state.allTransactions,doc.data()],
                    lastVisibleTransaction:doc
                }) 
             })
        }
    }
    componentDidMount=async()=>{
        const query=await db.collection('Transactions').get()
        query.docs.map(doc=>{
           this.setState({
               allTransactions:[...this.state.allTransactions,doc.data()]
           }) 
        })
    }
    render(){
        return(
            <View>
            <View>
            <TextInput placeholder='Enter BookID or StudentID'
                onChangeText={(text)=>{
                    this.setState({
                        search:text
                    })
                }}
                value={this.state.search}
                />
                <TouchableOpacity
                onPress={()=>{this.searchTransaction(this.state.search)}}
                >
                    <Text>search</Text>
                </TouchableOpacity> 
            </View>
            
           <FlatList
           data={this.state.allTransactions}
           renderItem={({item})=>{
               <View style={{borderBottomWidth:2}}> 
               <Text>{'BookID'+item.BookID }</Text>
               <Text>{'StudentID'+item.StudentID}</Text>
               <Text>{'TransactionType'+item.TransactionType}</Text>
               <Text>{'Date'+item.date.toDate()}</Text>
               </View>
           }}
           keyExtractor={(item,index)=>index.toString()}
           />
           </View>
        )
    }
} 