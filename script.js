const petForm = document.getElementById("petForm");
const petRecords = document.getElementById("petRecords");
const totalPets = document.getElementById("totalPets");

let pets = JSON.parse(localStorage.getItem("madhumithaPets")) || [];

function savePets() {
    localStorage.setItem("madhumithaPets", JSON.stringify(pets));
}

function displayPets() {
    petRecords.innerHTML = "";
    totalPets.textContent = pets.length;

    if (pets.length === 0) {
        petRecords.innerHTML = "<p>No pets registered yet.</p>";
        return;
    }

    pets.forEach((pet) => {
        const card = document.createElement("div");
        card.className = "pet-card";

        const img = document.createElement("img");
        img.src = pet.photo || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600";
        img.alt = pet.name;

        const title = document.createElement("h3");
        title.textContent = "🐾 " + pet.name;

        const details = document.createElement("p");
        details.textContent =
            "Type: " + pet.type +
            " | Age: " + pet.age +
            " | Owner: " + pet.owner +
            " | Phone: " + pet.phone;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => editPet(pet.id));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => deletePet(pet.id));

        card.append(img, title, details, editBtn, deleteBtn);
        petRecords.appendChild(card);
    });
}

petForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const editId = document.getElementById("editId").value;
    const photoFile = document.getElementById("petPhoto").files[0];

    const pet = {
        id: editId || Date.now().toString(),
        name: document.getElementById("petName").value.trim(),
        type: document.getElementById("petType").value,
        age: document.getElementById("petAge").value,
        owner: document.getElementById("ownerName").value.trim(),
        phone: document.getElementById("phone").value.trim()
    };

    const savePet = (photo) => {
        pet.photo = photo;

        if (editId) {
            const index = pets.findIndex(p => p.id === editId);
            if (index !== -1) {
                pets[index] = pet;
            }
            alert("Pet details updated successfully!");
        } else {
            pets.push(pet);
            alert("Pet registered successfully!");
        }

        savePets();
        displayPets();
        petForm.reset();
        document.getElementById("editId").value = "";
        document.getElementById("submitBtn").textContent = "Add Pet";
        document.getElementById("cancelBtn").hidden = true;
    };

    if (photoFile) {
        const reader = new FileReader();

        reader.onload = function() {
            savePet(reader.result);
        };

        reader.readAsDataURL(photoFile);
    } else {
        const existingPet = pets.find(p => p.id === editId);
        savePet(existingPet ? existingPet.photo : "");
    }
});

function editPet(id) {
    const pet = pets.find(p => p.id === id);

    if (!pet) return;

    document.getElementById("editId").value = pet.id;
    document.getElementById("petName").value = pet.name;
    document.getElementById("petType").value = pet.type;
    document.getElementById("petAge").value = pet.age;
    document.getElementById("ownerName").value = pet.owner;
    document.getElementById("phone").value = pet.phone;

    document.getElementById("submitBtn").textContent = "Update Pet";
    document.getElementById("cancelBtn").hidden = false;

    document.getElementById("register").scrollIntoView({
        behavior: "smooth"
    });
}

function deletePet(id) {
    if (confirm("Are you sure you want to delete this pet?")) {
        pets = pets.filter(pet => pet.id !== id);
        savePets();
        displayPets();
        alert("Pet deleted successfully!");
    }
}

document.getElementById("cancelBtn").addEventListener("click", function() {
    petForm.reset();
    document.getElementById("editId").value = "";
    document.getElementById("submitBtn").textContent = "Add Pet";
    this.hidden = true;
});

displayPets();