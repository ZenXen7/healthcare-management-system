import { useUpdateMedicationHistory } from './useUpdateMedicationHistory.js';
import { getApiEndpoint } from "../../utils/getApiEndpoint.js";

async function fetchMedicationHistory(page = 1) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const ENDPOINT = getApiEndpoint();

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${ENDPOINT}/api/patient/fetch/${id}/medication_history/?page=${page}`, {
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

function formatMedicationData(item) {
    const date_added = new Date(item.date_added).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    });
    const date_prescribed = new Date(item.date_prescribed).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit'
    });

    const generic_name = item.generic_name.charAt(0).toUpperCase() + item.generic_name.slice(1);

    return { ...item, date_added, date_prescribed, generic_name };
}

// Pagination rendering function
function renderMedicationPagination(totalPages, currentPage) {
    const medication_history_navigation = document.getElementById('medication-history-navigation');
    medication_history_navigation.innerHTML = '';

    medication_history_navigation.insertAdjacentHTML('beforeend', `
        <li style="display: inline;">
            <a href="#" class="medication-pagination-link" data-page="${currentPage > 1 ? currentPage - 1 : 1}"
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
        medication_history_navigation.insertAdjacentHTML('beforeend', `
            <li style="display: inline;">
                <a href="#" class="medication-pagination-link" data-page="${i}" 
                   style="display: flex; align-items: center; justify-content: center; padding: 0.5rem 0.75rem; 
                          height: 32px; ${i === currentPage ? 'color: gray; border: 1px solid #D1D5DB;' : 'color: #054F99;'}
                          border-radius: 0.375rem; text-decoration: none;">
                    ${i}
                </a>
            </li>
        `);
    }

    medication_history_navigation.insertAdjacentHTML('beforeend', `
        <li style="display: inline;">
            <a href="#" class="medication-pagination-link" data-page="${currentPage < totalPages ? currentPage + 1 : totalPages}"
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

    document.querySelectorAll('.medication-pagination-link').forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault(); 
            const newPage = link.dataset.page; 

            const medication_history = await fetchMedicationHistory(newPage);
            if (medication_history) {
                updateMedicationHistoryTable(medication_history);
                renderMedicationPagination(medication_history.total_pages, medication_history.current_page);
            }
        });
    });
}

function updateMedicationHistoryTable(medicationHistory) {
    const medication_history_body = document.getElementById('medication-history-body');
    medication_history_body.innerHTML = ''; 

    if (medicationHistory.results.length === 0) {
        medication_history_body.innerHTML = 
        `<tr class="border-b border-t">
            <td colspan="6" class="text-center py-3">
            No Medication Records Found
            </td>
        </tr>`;
        return;
    }

    medicationHistory.results.reverse().forEach(item => {
        const formatted_item = formatMedicationData(item);
        const row = `
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    ${formatted_item.date_added}
                </th>
                <td class="px-6 py-4">${formatted_item.date_prescribed}</td>
                <td class="px-6 py-4">${formatted_item.generic_name}</td>
                <td class="px-6 py-4">${formatted_item.dosage}</td>
                <td class="px-6 py-4">${formatted_item.quantity}</td>
                <td class="px-6 py-4">${formatted_item.instructions}</td>
                <td class="px-6 py-4 text-right">
                    <p href="#" class="edit-link cursor-pointer font-medium text-blue_main dark:text-blue-500 hover:underline" data-id="${item.id}">Edit</p>
                </td>
            </tr>
        `;
        medication_history_body.insertAdjacentHTML('beforeend', row);
    });
}


// Attach event delegation to the parent element
document.getElementById('medication-history-body').addEventListener('click', (event) => {
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

    useUpdateMedicationHistory(itemId)
}

// Initial fetch on page load
document.addEventListener('DOMContentLoaded', async function () {
    const medication_history = await fetchMedicationHistory();
    if (medication_history) {
        updateMedicationHistoryTable(medication_history);
        renderMedicationPagination(medication_history.total_pages, medication_history.current_page);
    } else {
        console.error("Error fetching medication history");
    }
});



// Filter for medication
// TODO: add function to fetch medication either prescribed by you or prescribed by all
const btnAll = document.getElementById('btn-medication-by-all');
const btnYou = document.getElementById('btn-medication-by-you');

// Class to toggle
const activeClasses = ['border-b-2', 'text-blue_main', 'border-blue_main', 'font-medium'];

btnAll.addEventListener('click', () => {
    activeClasses.forEach(cls => btnYou.classList.remove(cls));
    activeClasses.forEach(cls => btnAll.classList.add(cls));

    // Perform action for "Prescribed by all"
    console.log('Showing medications prescribed by all.');
});

btnYou.addEventListener('click', () => {
    activeClasses.forEach(cls => btnAll.classList.remove(cls));
    activeClasses.forEach(cls => btnYou.classList.add(cls));

    // Perform action for "Prescribed by you"
    console.log('Showing medications prescribed by you.');
});

