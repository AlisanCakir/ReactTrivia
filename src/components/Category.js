import React, {useState,useEffect} from 'react';
import Select from 'react-select';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Lottie from 'react-lottie';
import * as animationData from '../lottieJson/loading.json'

const useStyles = makeStyles({
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  textColor:{
    color: 'white'
  }
});

export default function Category({history}) {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [selectedDifficulty, setselectedDifficulty] = useState([]);
  
  useEffect(() => {
    fetch('https://opentdb.com/api_category.php')
      .then(results => results.json())
      .then(data => {
        setData(data.trivia_categories);
      });
  },[selectedDifficulty]);
  
  const handleChange = (option) => {
    setselectedDifficulty( option )
  };

  const optionsDifficultySelect = [
    { value: 'any', label: 'Any Difficulty' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
  ];

  if (data.length === 0) {
    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: animationData.default,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return(
      <div style={{display: 'flex',flex:1,justifyContent:"center",alignItems:'center', height: '100vh'}}>
        <Lottie 
          options={defaultOptions}
          height={500}
          width={500}
          />
      </div>
    ) 
  }
  else {
    return (
      <div>
         <div style={{display: 'flex',flex:1,alignItems:'center', justifyContent:"center",flexDirection:'column'}}>
        <h1 className={classes.textColor} style={{display: 'flex',justifyContent:"center"}}>Select Difficulty</h1>
        <div style={{width: '300px'}}>
          <Select
            value={selectedDifficulty}
            onChange={handleChange}
            options={optionsDifficultySelect}
          />
          </div>
          </div>
        <h1 className={classes.textColor} style={{display: 'flex', justifyContent:"center"}}>Select Category</h1>
        <Box display="flex" alignItems="center" flexDirection="row" justifyContent="center" flexWrap='wrap' >
        {data.map((data) => {
          return (
            <Box key={data.id} p={1} >
            <Card className={classes.card} raised={true} style={{ margin:10 }}>
              <CardContent style={{ backgroundColor:'wheat'}}>
                <Typography style={{ color:'black',display: 'flex', justifyContent:"center"}} variant="h6" component="h2" gutterBottom>
                  {data.name.substring(data.name.indexOf(':')+1)}
                </Typography>
              </CardContent>
              <CardActions style={{ backgroundColor:'wheat',justifyContent: 'center', alignItems: 'center', padding:20}}>
                  <Button color="primary" variant="contained" size="medium" onClick={() => {
                    history.push("/MainQuiz", {
                      selectedDifficulty: selectedDifficulty.value,
                      categoryId: data.id
                    });
                  }}>Get Started</Button>
              </CardActions>
            </Card>
            </Box>
          )})
        }
        </Box>
      </div>
    )
  }
}
