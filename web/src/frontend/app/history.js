import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';

export default useRouterHistory(createHistory)({ basename: '/portefolje' });
