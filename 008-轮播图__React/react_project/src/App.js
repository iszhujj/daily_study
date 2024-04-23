import SlidePictures from './components/SlidePictures/SlidePictures'
import './App.scss'

function App() {
    const picturesArr = (()=>{
        let size = Math.round(Math.random() * 6);
        return ['aaa','bbb','ccc','ddd','eee','fff'].map((e, i) => {
            return {
                src:`/pictures/${e}.jpg`,
                alt:e,
                index:i
            }
        }).slice(0, size + 1)
    })()
    return(
        <div className='App-container'>
            <h1>轮播图</h1>
            <SlidePictures picturesArr={picturesArr} width={700} height={450}/>
        </div>
    );
}

export default App;
