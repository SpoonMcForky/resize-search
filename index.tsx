import { UPlugin } from '@classes';
import { getByDisplayName, React } from '@webpack';
const ConnectedSearchResults = getByDisplayName('ConnectedSearchResults', { ret: 'exports' });
const Patcher = require('@patcher');
const settings = Astra.settings.get('resize-search');

export default class resize extends UPlugin {
  start() {
    this.patchComponent(); 
  }
  patchComponent() {
    const div = document.createElement('div');
    div.setAttribute('class', 'resizeHandle-T_gFJR');
    try {
      Patcher.after('patch', ConnectedSearchResults, 'default', (_: any, _ret: any, _args: any) => {
        React.useEffect(() => {
          const element = document.querySelector('.searchResultsWrap-5RVOkx');
          const parent = document.getElementsByClassName('searchResultsWrap-5RVOkx');
          let mousePosition: number;
          try {
            (parent as HTMLCollectionOf<HTMLElement>)[0].style.width = `${settings.get('width', 400)}px`;
          } catch (e) {
            console.log(e); 
          }
          function resize(e: { x: any }) {
            mousePosition = e.x; 
            (parent as HTMLCollectionOf<HTMLElement>)[0].style.width = `${Math.abs(mousePosition - window.innerWidth)}px`; 
            const width = Math.abs(mousePosition - window.innerWidth);
            settings.set('width', width); 
          }
          function mouseUp() {
            document.removeEventListener('mousemove', resize, false);
            element.appendChild(div);
          }
          function mouseDown(e: { offsetX: number, x: number }) {
            if (e.offsetX < 4) {
              mousePosition = e.x;
              document.addEventListener('mousemove', resize, false); 
            }
          }
          div.addEventListener('mousedown', mouseDown, false);
          document.addEventListener('mouseup', mouseUp, false);
          return () => {
            document.removeEventListener('mousemove', resize, false);
            document.removeEventListener('mouseup', mouseUp, false);
            div.removeEventListener('mousedown', mouseDown, false);
          };
        }, []);
      });
    } catch (e) {
      console.log(`Patcher failed to patch with error: ${e}`); // Arbitrary erorr handling
    }
  }
  stop() {
    Patcher.unpatchAll('patch');

  }
}
