import { hy } from './letters';

const armToLat = (text: string): string => {
    text = text.toLocaleLowerCase();
    let regex = new RegExp(Object.keys(hy).join('|'), 'gi');
    return text.replace(regex, (matched) => { 
        return hy[matched];
    });  
}

export const slugconverter = (slug: string): string => {
    slug = decodeURIComponent(slug);
    slug = armToLat(slug);
    slug = slug.replace(/ /g, '-').replace(/[^\w-]+/g, '');
    return encodeURI(slug);
}