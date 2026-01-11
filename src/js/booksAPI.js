import axios from 'axios';

const BASE_URL = "https://books-backend.p.goit.global";
const END_POINTS = [
    "/books/category-list",
    "/books/top-books",
    "/books/category",
    "/books",
];


//Belirtilen kategorideki kitapların listesini API' den getiriyor.
export async function getCategoryList() {
    const url = "${BASE_URL}${END_POINTS[0]}";
    try {
        const response = await axios.get(url);
        const sortedData = response.data.sort((a, b) =>
            a.list_name.localeCompare(b.list_name)
        );
        return sortedData;
    } catch (error) {
        console.error("Error fetching category list: ", error);
        throw error;
    }
}


//En çok satan kitapları API' den getiriyor.
export async function getTopBooks() {
    const url = `${BASE_URL}${END_POINTS[1]}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching top books: ", error);
        throw error;
    }
}


//Belirtilen kategorideki kitapları API' den getiriyor.
export async function getBooksByCategory(category) {
    const url = `${BASE_URL}${END_POINTS[2]}`;
    const params = {
        category: category,
    };
    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching books by category: ", error);
        throw error;
    }
}


//Belirtilen ID'ye sahip kitabı API' den getiriyor.
export async function getBookById(id) {
    const url = `${BASE_URL}${END_POINTS[3]}/${id}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching book by ID: ", error);
        throw error;
    }
}


//Birden fazla kitabı ID'lerine göre API'den getiriyor.
export async function getBookByIds(idsArray) {
    try {
        const booksArray = [];

        for (let id of idsArray) {

            const url = `${BASE_URL}${END_POINTS[3]}/${id}`;
            const response = await axios.get(url);
            booksArray.push(response.data);
        }
        return booksArray;
    } catch (error) {
        console.error("Error fetching books by IDs: ", error);
        throw error;
    }
}


