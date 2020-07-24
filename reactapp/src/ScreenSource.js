import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import './App.css';
import { List, Avatar} from 'antd';
import Nav from './Nav'
import { connect } from 'react-redux';

function ScreenSource(props) {

  const [sourceList, setSourceList] = useState([])
  const [selectedLang, setSelectedLang] = useState(props.selectedLang)


  useEffect(() => {
    const APIResultsLoading = async() => {
      var langue = 'fr'
      var country = 'fr'
        
      if(selectedLang === 'en'){
        var langue = 'en'
        var country = 'us'
      }
      props.changeLang(selectedLang)
      const data = await fetch(`https://newsapi.org/v2/sources?language=${langue}&country=${country}&apiKey=8d6c227654d54279b142fb0404005655`)
      const body = await data.json()
      setSourceList(body.sources)
    }

    APIResultsLoading()
  }, [selectedLang])

  var saveLanguage = async () => {
    
    const data = await fetch('/languages', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `languageFromFront=${selectedLang}`
    })

    const body = await data.json()

  }

  // get user's wishlist from db
  useEffect ( () => {
    async function loadData () {
      const rawResponse = await fetch(`/getarticles?token=${props.token}`)
      var response = await rawResponse.json()
      var listeArticles = response.articles
      props.recordWishListFromDB(listeArticles)
    }
    loadData()

  }, [])



  return (
    <div>
        <Nav/>
       
       <div style={{display:'flex', justifyContent:'center', alignItems:'center'}} className="Banner">
          <img style={{width:'40px', margin:'10px',cursor:'pointer'}} src='/images/fr.png' onClick={() => {setSelectedLang('fr');saveLanguage()}} />
          <img style={{width:'40px', margin:'10px',cursor:'pointer'}} src='/images/uk.png' onClick={() => {setSelectedLang('en');saveLanguage()}} /> 
        </div>

       <div className="HomeThemes">
          
              <List
                  itemLayout="horizontal"
                  dataSource={sourceList}
                  renderItem={source => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={`/images/${source.category}.png`} />}
                        title={<Link to={`/screenarticlesbysource/${source.id}`}>{source.name}</Link>}
                        description={source.description}
                      />
                    </List.Item>
                  )}
                />


          </div>
                 
      </div>
  );
}

function mapStateToProps(state){
  return {selectedLang: state.selectedLang,
          token: state.token}
}

function mapDispatchToProps(dispatch){
  return {
    changeLang: function(selectedLang){
      dispatch({type: 'changeLang', selectedLang: selectedLang})
    },
    recordWishListFromDB : function(array) {
      dispatch({type: 'initArticle',
        articlesFromDB: array })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenSource)
