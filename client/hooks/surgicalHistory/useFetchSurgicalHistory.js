import { useUpdateSurgicalHistory } from './useUpdateSurgicalHistory.js';
import { getApiEndpoint } from "../../utils/getApiEndpoint.js";

async function fetchSurgicalHistory(page = 1) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const ENDPOINT = getApiEndpoint();

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${ENDPOINT}/api/patient/fetch/${id}/surgical_history/?page=${page}`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch patient data");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching patient details:", error);
        return null;
    }
}

function formatSurgicalData(item) {
    const date_added = new Date(item.date_added).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    });

    const operation_date = new Date(item.operation_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    });

    return { ...item, date_added, operation_date};
}

// Pagination rendering function
function renderSurgicalPagination(totalPages, currentPage) {
    const surgical_history_navigation = document.getElementById('surgical-history-navigation');
    surgical_history_navigation.innerHTML = '';

    surgical_history_navigation.insertAdjacentHTML('beforeend', `
        <li style="display: inline;">
            <a href="#" class="surgical-pagination-link" data-page="${currentPage > 1 ? currentPage - 1 : 1}"
               style="display: flex; align-items: center; justify-content: center; padding: 0.5rem 0.75rem; 
                      height: 32px; color: rgb(163 163 163); background: white;
                      transition: background-color 0.2s; text-decoration: none;">
                <span style="display: none;">Previous</span>
                <svg style="width: 0.625rem; height: 0.625rem;" 
                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
                </svg>
            </a>                       
        </li>
    `);

    for (let i = 1; i <= totalPages; i++) {
        surgical_history_navigation.insertAdjacentHTML('beforeend', `
            <li style="display: inline;">
                <a href="#" class="surgical-pagination-link" data-page="${i}" 
                   style="display: flex; align-items: center; justify-content: center; padding: 0.5rem 0.75rem; 
                          height: 32px; ${i === currentPage ? 'color: gray; border: 1px solid #D1D5DB;' : 'color: #054F99;'}
                          border-radius: 0.375rem; text-decoration: none;">
                    ${i}
                </a>
            </li>
        `);
    }

    surgical_history_navigation.insertAdjacentHTML('beforeend', `
        <li style="display: inline;">
            <a href="#" class="surgical-pagination-link" data-page="${currentPage < totalPages ? currentPage + 1 : totalPages}"
               style="display: flex; align-items: center; justify-content: center; padding: 0.5rem 0.75rem; 
                      height: 32px; color: rgb(163 163 163); background: white;
                      transition: background-color 0.2s; text-decoration: none;">
                <span style="display: none;">Next</span>
                <svg style="width: 0.625rem; height: 0.625rem;" 
                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
                </svg>
            </a>                       
        </li>
    `);

    document.querySelectorAll('.surgical-pagination-link').forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault(); 
            const newPage = link.dataset.page; 

            const surgical_history = await fetchSurgicalHistory(newPage);
            if (surgical_history) {
                updateSurgicalHistoryTable(surgical_history);
                renderSurgicalPagination(surgical_history.total_pages, surgical_history.current_page);
            }
        });
    });
}

function updateSurgicalHistoryTable(surgicalHistory) {
    const surgical_history_body = document.getElementById('surgical-history-body');
    surgical_history_body.innerHTML = ''; 

    if (surgicalHistory.results.length === 0) {
        surgical_history_body.innerHTML = 
        `<tr class="border-b border-t">
            <td colspan="5" class="text-center py-3">
            No Surgical Records Found
            </td>
        </tr>`;
        return;
    }

    surgicalHistory.results.reverse().forEach(item => {
        const formatted_item = formatSurgicalData(item);
        const row = `
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                ${formatted_item.date_added}
            </th>
            <td class="px-6 py-4">${formatted_item.operation_procedure}</td>
            <td class="px-6 py-4">${formatted_item.indication}</td>
            <td class="px-6 py-4">${formatted_item.hospital}</td>
            <td class="px-6 py-4">${formatted_item.operation_date}</td>
            <td class="px-6 py-4 text-right">
                <p href="#" class="edit-link cursor-pointer font-medium text-blue_main dark:text-blue_main hover:underline" data-id="${item.id}">Edit</p>
            </td>
            </tr>
        `;
        surgical_history_body.insertAdjacentHTML('beforeend', row);
    });
}

// Attach event delegation to the parent element
document.getElementById('surgical-history-body').addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-link')) {
        const itemId = event.target.getAttribute('data-id');
        updateUrlParameters(itemId);
    }
});

function updateUrlParameters(itemId) {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    params.set('edit_id', itemId);

    window.history.replaceState({}, '', `${url.pathname}?${params.toString()}`);

    useUpdateSurgicalHistory(itemId)
}

// Initial fetch on page load
document.addEventListener('DOMContentLoaded', async function () {
    const surgical_history = await fetchSurgicalHistory();
    if (surgical_history) {
        updateSurgicalHistoryTable(surgical_history);
        renderSurgicalPagination(surgical_history.total_pages, surgical_history.current_page);
    } else {
        console.error("Error fetching surgical history");
    }
});
