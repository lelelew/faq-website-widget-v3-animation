import React, { useState, useEffect } from "react";
import Anime from "react-anime";
import Chip from "@material-ui/core/Chip";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import {
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  CardActions
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles({
  root: {
    position: "fixed",
    bottom: 20,
    left: "50%",
    marginLeft: -160
  },
  card: {
    position: "fixed",
    bottom: 20,
    marginLeft: -12,
    zIndex: -1,
    maxWidth: 344
  },
  cardActions: {
    marginTop: 55,
    overflowX: "scroll"
  },
  closeButton: {
    position: "absolute",
    top: 2,
    right: 2
  },
  closeButtonIcon: {
    width: 14,
    height: 14
  },
  collapsedTitle: {
    width: 270,
    height: 24,
    position: "relative"
  },
  collapsedTitleText: {
    width: 270,
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "absolute",
    left: 0,
    top: 0
    // textOverflow: "ellipsis"
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    overflowX: "scroll"
  },
  chip: {
    marginLeft: 5
  },
  chipLabel: {
    maxWidth: 180,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "inline-block"
  },
  preview: {
    alignItems: "center",
    display: "flex",
    cursor: "pointer"
  },

  searchInput: {
    width: "100%"
  },
  title: {
    fontSize: 14
  },
  widget: {
    boxSizing: "border-box",
    padding: 10,
    boxShadow: "0px 0px 2px 2px rgba(200, 200, 200, 0.25)",
    borderRadius: 3,
    backgroundColor: "white",
    width: 320,
    overflowX: "scroll",
    marginBottom: 55
  },
  widgetNoBorder: {
    border: "none",
    boxSizing: "border-box",
    padding: 10,
    backgroundColor: "white",
    width: 320,
    overflowX: "scroll",
    marginBottom: 55
  }
});

const topics = [
  {
    title: "What's the risk free trial?",
    content: `We believe you should sleep on these products to decide if you like them, so we give you up to 100 nights to try them in your own home. If they don’t work out, returns are free and easy.`
  },
  {
    title: "Plush and firm - what's the difference?",
    content: `Both mattresses share the same quality base and construction. Plush mattresses are designed with an extra-soft topper that conforms to your body's shape for extra comfort.`
  },
  {
    title: "Sleeping solo?",
    content: `When you sleep solo there's less worry about motion transimission throughout the night, so choosing a mattress for yourself comes down to your own preferences and you're free to choose whatever style, firm or plush, that best suits you.`
  }
];

const App = props => {
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = useState(false);
  const [chosenTopic, setChosenTopic] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      if (previewIndex === null) {
        setPreviewIndex(0);
        return;
      }
      let nextPreviewIndex = previewIndex + 1;
      if (nextPreviewIndex >= topics.length) {
        nextPreviewIndex = 0;
      }
      setPreviewIndex(nextPreviewIndex);
    }, 8000);
  }, [previewIndex]);

  const previousIndex =
    previewIndex - 1 >= 0 ? previewIndex - 1 : topics.length - 1;

  return (
    <div className={classes.root}>
      {chosenTopic ? (
        <Slide
          direction="up"
          in={chosenTopic !== null}
          mountOnEnter
          unmountOnExit
        >
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary">
                {chosenTopic.title}
                <IconButton
                  className={classes.closeButton}
                  size="small"
                  onClick={() => {
                    setChosenTopic(null);
                    setIsExpanded(false);
                  }}
                >
                  <CloseIcon className={classes.closeButtonIcon} />
                </IconButton>
              </Typography>

              <Typography
                variant="body2"
                component="p"
                dangerouslySetInnerHTML={{ __html: chosenTopic.content }}
              ></Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
              {topics.map((topic, index) => {
                return (
                  <Chip
                    key={index}
                    className={classes.chip}
                    classes={{
                      label: classes.chipLabel
                    }}
                    label={topic.title}
                    onClick={() => {
                      setChosenTopic(topic);
                    }}
                  />
                );
              })}
            </CardActions>
          </Card>
        </Slide>
      ) : null}
      <div className={chosenTopic ? classes.widgetNoBorder : classes.widget}>
        <div className={classes.buttons}>
          {isExpanded ? (
            <TextField
              className={classes.searchInput}
              placeholder="type to search.."
              autoFocus
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon
                      onClick={() => {
                        setIsExpanded(!isExpanded);
                      }}
                    />
                  </InputAdornment>
                )
              }}
              size="small"
            />
          ) : (
            <div
              className={classes.preview}
              onClick={() => {
                setIsExpanded(!isExpanded);
                //change to pass in topic
                setChosenTopic(topics[previewIndex]);
              }}
            >
              <div className={classes.collapsedTitle}>
                {topics.map((topic, index) => {
                  if (previewIndex === index || previousIndex === index) {
                    const animePropsIn = {
                      opacity: [0, 1],
                      easing: "easeInOutQuad",
                      duration: "2250",
                      delay: (el, i) => 150 * (i + 1)
                    };
                    const animePropsOut = {
                      opacity: [1, 0],
                      easing: "easeOutExpo",
                      duration: "1000",
                      delay: "7000"
                    };
                    return (
                      <Typography
                        key={index}
                        className={classes.collapsedTitleText}
                        component="div"
                      >
                        <Anime {...animePropsOut}>
                          <div>
                            <Anime {...animePropsIn}>
                              {topic.title.split("").map((character, index) => {
                                return (
                                  <span key={index} className="anime-letter">
                                    {character}
                                  </span>
                                );
                              })}
                            </Anime>
                          </div>
                        </Anime>
                      </Typography>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
              <IconButton size="small">
                <SearchIcon />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
