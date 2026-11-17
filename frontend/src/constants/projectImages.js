import awsImg from '../assets/images/projects/aws.jpeg'
import beautyImg from '../assets/images/projects/beauty.jpeg'
import meImg from '../assets/images/projects/me.jpeg'
import museoImg from '../assets/images/projects/museo.jpeg'
import publikaImg from '../assets/images/projects/publika.jpeg'
import realestateImg from '../assets/images/projects/realestate.jpeg'
import smpImg from '../assets/images/projects/smp.jpeg'
import trustpulseImg from '../assets/images/projects/trustpulse.jpeg'
import shopscoutImg from '../assets/images/projects/shopscout.jpeg'
import airsiloyImg from '../assets/images/projects/airsiloy.jpeg'
import hapsayImg from '../assets/images/projects/hapsay.jpeg'
import baiImg from '../assets/images/projects/bAI.jpeg'
import hulmaImg from '../assets/images/projects/hulma.jpeg'
import agenticaImg from '../assets/images/projects/agentica.jpeg'
import worthoutImg from '../assets/images/projects/worthout.jpeg'

export const PROJECT_IMAGES = {
  'awscc-flurry': awsImg,
  beauty: beautyImg,
  me: meImg,
  museo: museoImg,
  publika: publikaImg,
  realestate: realestateImg,
  smp: smpImg,
  trustpulse: trustpulseImg,
  shopscout: shopscoutImg,
  airsiloy: airsiloyImg,
  hapsay: hapsayImg,
  bai: baiImg,
  hulma: hulmaImg,
  agentica: agenticaImg,
  worthout: worthoutImg,
}

export const getProjectImage = (id) => PROJECT_IMAGES[id] ?? null
