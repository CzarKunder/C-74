import React,{Component} from 'react'
import {View,Text,TouchableOpacity,TextInput} from 'react-native'
import * as Permissions from 'expo-permissions'
import {BarCodeScanner} from 'expo-barcode-scanner'
import * as firebase from 'firebase'
import db from '../config'
export default class BookTransactionScreen extends Component{
    constructor(){
        super()
        this.state={
            hasCameraPermission:null,
            scanData:'',
            scan:false,
            buttonState:'normal',
            scanBookId:'',
            scanStudentID:'',
            transactionMessage:'',

        }
    }
    GetCameraPermission=async(id)=>{
        const {status}=await Permissions.askAsync(Permissions.CAMERA)
        this.setState({
            hasCameraPermission:status==='granted',
            buttonState:id,
            scan:false
            
        })
        
    }
    HandleBarcodeScan=async({type,data})=>{
        const {buttonState}=this.state
        if(buttonState==='BookId'){
            this.setState({
                scan:true,
                scanBookId:data,
                buttonState:'normal'
            })
        }
        else if(buttonState==='StudentId'){
            this.setState({
                scan:true,
                scanStudentId:data,
                buttonState:'normal'
            })
        }
    }
    handleTransaction=async()=>{

    var transactionType=await this.checkBookEligibility()
    console.log(transactionType)
    if(!transactionType){
        alert('the book doesnt exist in the library database')
            this.setState({
                scanStudentId:'',
                scanBookId:'',
            })
        }
        else if(transactionType==='issue'){
        var isStudentEligible=await this.checkSutdentEligibilityForBookIssue()
        if(isStudentEligible){
            this.initiateBookIssue()
            alert('book issued to the student')
        }
        }
       else{
        var isStudentEligible=await this.checkSutdentEligibilityForReturn()
        if(isStudentEligible){
            this.initiateBookReturn()
            alert('book returned to the library')
        }   
       }
return transactionType

    }
checkStudentEligibilityForBookIssue=async()=>{
    const studentRef=await db.collection('Students').where('StudentID','==',this.state.scanStudentID).get()
    var isStudentEligible=''
    if(studentRef.docs.length==0){
        this.setState({
            scanStudentId:'',
            scanBookId:'',
        })
        isStudentEligible=false
        alert('the StudentID does not exist in the database')   
    }
    else{
        studentRef.docs.map(doc=>{
            var student=doc.data()
            if(student.NumbersOfBooksIssued<2){
                isStudentEligible=true
            }
            else {
                isStudentEligible=false
                alert('the student has aleady recieved two books')
                this.setState({
                    scanStudentId:'',
                    scanBookId:'',
                })
            }
        })
    }
    return isStudentEligible
}
checkStudentEligibilityForReturn=async()=>{
const transactionRef=await db.collection('Transactions').where('BookID','==',this.state.scanBookId).limit(1).get()
var isStudentEligible=''
    
        transactionRef.docs.map(doc=>{
            var lastBookTransaction=doc.data()
            if(lastBookTransaction.StudentID===this.state.scanStudentID){
                isStudentEligible=true
            }
            else {
                isStudentEligible=false
                alert('the book was not issued by this student')
                this.setState({
                    scanStudentId:'',
                    scanBookId:'',
                })
            }
        })
    
    return isStudentEligible
}
  checkBookEligibility=async()=>{
      const bookRef=await db.collection('Books').where('BookID','==',this.state.scanBookId).get()
      var transactionType=''
      if(bookRef.docs.length==0){
          transactionType=false
      }
      else{
          bookRef.docs.map(doc=>{
              var book=doc.data()
              if(book.BookAvailability){
                  transactionType='issue'
              }
              else{
                  transactionType='return'
              }
          })
      }
      returnTransactionType
  }
    initiateBookIssue=async()=>{
        db.collection('Transactions').add({
            'studentID':this.state.scanStudentID,
            'bookID':this.state.scanBookId,
            'date':firebase.firestore.Timestamp.now().toDate(),
            'transactionType':'issued'
        })
        db.collection('Books').doc(this.state.scanBookId).update({'BookAvailability':false})
        db.collection('Student').doc(this.state.scanStudentID).update({'NumbersOfBooksIssued':firebase.firestore.FieldValue.increment(1)})
        alert('bookIssue')
        this.setState({
            scanBookId:'',
            scanStudentID:'',
        })
    }
    initiateBookReturn=async()=>{
        db.collection('Transactions').add({
            'studentID':this.state.scanStudentID,
            'bookID':this.state.scanBookId,
            'date':firebase.firestore.Timestamp.now().toDate(),
            'transactionType':'return'
        })
        db.collection('Books').doc(this.state.scanBookId).update({'BookAvailability':true})
        db.collection('Student').doc(this.state.scanStudentID).update({'NumbersOfBooksIssued':firebase.firestore.FieldValue.increment(-1)})
        alert('bookIssue')
        this.setState({
            scanBookId:'',
            scanStudentID:'',
        })
    }
    render(){
        if (this.state.buttonState!=='normal' && this.state.hasCameraPermission){
            return(
                <BarCodeScanner
                onBarCodeScanned={this.state.scan?undefined:this.HandleBarcodeScan}
                style={StyleSheet.absoluteFillObject}
                />
            )
        }
        else if(this.state.buttonState==='normal'){
        
        
        return(
            <View>
                <TextInput placeholder='Book ID'
                onChangeText={(text)=>{
                    this.setState({
                        scanBookId:text
                    })
                }}
                value={this.state.scanBookId}
                />
                <TouchableOpacity
                onPress={()=>{this.GetCameraPermission('BookId')}}
                >
                    <Text>Scan book ID</Text>
                </TouchableOpacity>
                <TextInput placeholder='Student ID'
                onChangeText={(text)=>{
                    this.setState({
                        scanStudentId:text
                    })
                }}
                value={this.state.scanStudentId}
                />
                <TouchableOpacity
                onPress={()=>{this.GetCameraPermission('StudentId')}}
                >
                    <Text>Scan student ID</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.handleTransaction}}>
                    <Text>
                        submit
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}   
}