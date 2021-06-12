import React, { useEffect, useState } from 'react'
import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red'
const primary = red['A200']
import amber from '@material-ui/core/colors/amber'
const secondary = amber['A400']
import {CssBaseline, ThemeProvider} from "@material-ui/core"
import Grid from '@material-ui/core/Grid'
import Header from './Header';
import Footer from './Footer'
import Drawer from './MyDrawer'
import { MemoryRouter, Route} from 'react-router';

import Home from './Home/Home';
import MongoDB from './MongoDB/MongoDB';
import Oak from './Oak/Oak'
import Docker from './Docker/Docker'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: primary
        },
        secondary: {
            main: secondary
        },
        type: 'dark'
    }
});

interface Schema {
schemaName: string;
schemaId?: number;
schemaProperties: string[];
}

const dockerFileInit: string = `
FROM hayd/alpine-deno:1.10.2

# The port that your application listens to.
EXPOSE 3000

WORKDIR /phlappjack

# Prefer not to run as root.
# USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY . .
RUN deno cache --unstable deps.ts
RUN deno cache  ./client/deps.ts
# RUN deno bundle ./client/index.tsx ./build/bundle.js


# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
# RUN deno cache mod.ts

CMD ["deno", "run", "-A", "--unstable", "mod.ts"]
`

const dockerComposeFileInit: string = `
version: '3.1'

services:
  mongo:
    image: mongo
    restart: always
    ports:
      - 27018:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: 
      MONGO_INITDB_ROOT_PASSWORD:
      
  phlappjack
    image: phlappjack
    ports: 
      - 8000:8000
`

export default function App() {

    //State regarding new application.
    const [newApplication, setNewApplication] = useState('');
    //State regarding MongoDB tab.
    const [dbBeingModified, setDBBeingModified] = useState('DB Input Field');
        //State for schema models and properties.
    const [dbInputDisplay, setDBInputDisplay] = useState({});
        //State for mongo atlas username.
    const [atlasUserName, setAtlasUserName] = useState('');
        //State for mongo atlas password.
    const [atlasPassword, setAtlasPassword] = useState('');
        //State for mongo atlas cluster.
    const [atlasHostCluster, setAtlasHostCluster] = useState('');
        //State for mongo atlas username.
    const [atlasDB, setAtlasDB] = useState('');
    
    //State regarding Oak Tab.
    const [endPoints, setEndPoints] = useState({'/':[]});
    const [selectedEndPoint, setSelectedEndPoint] = useState('Routing Information');
        //State for routes.
    const [routes, setRoutes] = useState([]);

    //State regarding Docker Tab.
    const [dockerFile, setDockerFile] = useState(dockerFileInit);
    const [dockerCompose, setDockerCompose] = useState(dockerComposeFileInit);

    //Key state to allow for re-rendering from child props.
    const [childKey, setChildKey] = useState(0);
    const [open, setOpen] = useState(false);
    
    const handleDrawerOpen = () => {
      setOpen(true);    
    };

    const handleDrawerClose = () => {
      setOpen(false);
    };

    useEffect(() => {

        const newDockerFile: string = `FROM hayd/alpine-deno:1.10.2

# The port that your application listens to.
EXPOSE 3000

WORKDIR /${newApplication}

# Prefer not to run as root.
# USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY . .
RUN deno cache --unstable deps.ts
RUN deno cache  ./client/deps.ts
# RUN deno bundle ./client/index.tsx ./build/bundle.js


# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
# RUN deno cache mod.ts

CMD ["deno", "run", "-A", "--unstable", "mod.ts"]
`
        setDockerFile(newDockerFile);
        

        const newDockerComposeFile: string = `version: '3.1'

services:
  mongo:
    image: mongo
    restart: always
    ports:
      - 27018:27017
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${atlasUserName}
      MONGO_INITDB_ROOT_PASSWORD: ${atlasPassword}
      
${newApplication}:
    image:${newApplication}
    ports: 
      - 8000:8000
`
    setDockerCompose(newDockerComposeFile);

    })

    return (
        <MemoryRouter>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Grid container direction="column">
                <Grid item>
                    <Header 
                        open={open} 
                        handleDrawerOpen={handleDrawerOpen}
                        newApplication = {newApplication}
                    />
                </Grid>
                <Grid item container>
                    <Grid item xs={false} sm={2}>
                        <Drawer 
                            open={open} 
                            handleDrawerClose={handleDrawerClose}
                            key ={childKey}
                            setChildKey = {setChildKey}
                            dbBeingModified = {dbBeingModified}
                            setDBBeingModified = {setDBBeingModified}
                            dbInputDisplay = {dbInputDisplay}
                            setDBInputDisplay = {setDBInputDisplay}
                            newApplication = {newApplication}
                            setNewApplication = {setNewApplication}
                            atlasUserName = {atlasUserName}
                            setAtlasUserName = {setAtlasUserName}
                            atlasPassword = {atlasPassword}
                            setAtlasPassword = {setAtlasPassword}
                            atlasHostCluster = {atlasHostCluster}
                            setAtlasHostCluster = {setAtlasHostCluster}
                            atlasDB = {atlasDB}
                            setAtlasDB = {setAtlasDB}
                            dockerFile = {dockerFile}
                            setDockerFile = {setDockerFile}
                            dockerCompose = {dockerCompose}
                            setDockerCompose = {setDockerCompose}
                        />
                    </Grid>
                    <Grid item xs={12} sm={10}>
                        <Route exact path="/">
                            <Home
                                key ={childKey}
                                setChildKey = {setChildKey}
                                newApplication = {newApplication}
                                setNewApplication = {setNewApplication}
                            />
                        </Route>
                        <Route exact path="/mongo">
                            <MongoDB
                                key ={childKey}
                                setChildKey = {setChildKey}
                                dbBeingModified = {dbBeingModified}
                                setDBBeingModified = {setDBBeingModified}
                                dbInputDisplay = {dbInputDisplay}
                                setDBInputDisplay = {setDBInputDisplay}
                                atlasUserName = {atlasUserName}
                                setAtlasUserName = {setAtlasUserName}
                                atlasPassword = {atlasPassword}
                                setAtlasPassword = {setAtlasPassword}
                                atlasHostCluster = {atlasHostCluster}
                                setAtlasHostCluster = {setAtlasHostCluster}
                                atlasDB = {atlasDB}
                                setAtlasDB = {setAtlasDB}
                            />
                        </Route>
                        <Route exact path="/oak">
                            <Oak
                                key ={childKey}
                                endPoints = {endPoints}
                                setEndPoints = {setEndPoints}
                                setChildKey = {setChildKey}
                                selectedEndPoint = {selectedEndPoint}
                                setSelectedEndPoint = {setSelectedEndPoint}
                                routes = {routes}
                                setRoutes = {setRoutes}
                            />
                        </Route>
                        <Route exact path="/deno">
                            Placeholder
                        </Route>
                        <Route exact path="/docker">
                            <Docker
                                key ={childKey}
                                setChildKey = {setChildKey}
                                dbBeingModified = {dbBeingModified}
                                setDBBeingModified = {setDBBeingModified}
                                dbInputDisplay = {dbInputDisplay}
                                setDBInputDisplay = {setDBInputDisplay}
                                atlasUserName = {atlasUserName}
                                setAtlasUserName = {setAtlasUserName}
                                atlasPassword = {atlasPassword}
                                setAtlasPassword = {setAtlasPassword}
                                atlasHostCluster = {atlasHostCluster}
                                setAtlasHostCluster = {setAtlasHostCluster}
                                atlasDB = {atlasDB}
                                setAtlasDB = {setAtlasDB}
                                dockerFile = {dockerFile}
                                setDockerFile = {setDockerFile}
                                dockerCompose = {dockerCompose}
                                setDockerCompose = {setDockerCompose}
                                />
                        </Route>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container direction="column">
                <Footer></Footer>
            </Grid>
        </ThemeProvider>
        </MemoryRouter>
    )
}
