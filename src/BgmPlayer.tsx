import ReactPlayer from 'react-player'
import { useGameStore } from './zustand/store';

const BgmPlayer = () => {
    const { bgm } = useGameStore();
  return (
    <div className='fixed -top-40 -left-40'>
        <ReactPlayer src='https://m.youtube.com/watch?v=OO2kPK5-qno' className='w-40 h-40' playing={bgm.isPlaying} />
    </div>
  )
}

export default BgmPlayer