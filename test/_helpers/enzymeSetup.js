import configure from 'enzyme-adapter-react-helper';
import jMoment from 'moment-jalaali';

jMoment.locale('fa')
jMoment.loadPersian({
    usePersianDigits: false,
});

configure({ disableLifecycleMethods: true });
