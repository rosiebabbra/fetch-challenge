import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, TextField, MenuItem } from "@mui/material";
import ImportExportIcon from '@mui/icons-material/ImportExport';

const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

const DogTable: React.FC = () => {
    const [dogs, setDogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [nextPage, setNextPage] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [breedFilter, setBreedFilter] = useState("");
    const [zipCodeFilter, setZipCodeFilter] = useState("");
    const [radiusFilter, setRadiusFilter] = useState(10);

    const pageSize = 5;

    const fetchDogIds = async () => {
        setLoading(true);
        try {
            let zipCodesToSearch: string[] = [];

            if (zipCodeFilter && radiusFilter > 0) {
                // Get the latitude/longitude for the given ZIP code
                const locationResponse = await fetch(`${API_BASE_URL}/locations`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify([zipCodeFilter]),
                    credentials: "include",
                });

                if (!locationResponse.ok) {
                    throw new Error("Failed to fetch ZIP code location");
                }

                const locationData = await locationResponse.json();
                if (!locationData.length) {
                    console.warn("⚠️ No location data found for this ZIP code.");
                    return;
                }
                const { latitude, longitude } = locationData[0];

                // Fetch all ZIP codes within the radius
                const radiusResponse = await fetch(`${API_BASE_URL}/locations/search`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        geoBoundingBox: {
                            bottom_left: { lat: latitude - radiusFilter * 0.01, lon: longitude - radiusFilter * 0.01 },
                            top_right: { lat: latitude + radiusFilter * 0.01, lon: longitude + radiusFilter * 0.01 }
                        },
                        size: 1000
                    }),
                    credentials: "include",
                });

                if (!radiusResponse.ok) {
                    throw new Error("Failed to fetch nearby ZIP codes");
                }

                const radiusData = await radiusResponse.json();
                zipCodesToSearch = radiusData.results.map((loc: any) => loc.zip_code);
            }

            // Build the query string
            const queryParams = new URLSearchParams();
            queryParams.append("size", "25");
            queryParams.append("sort", `breed:${sortOrder}`);
            if (breedFilter) queryParams.append("breeds", breedFilter);
            zipCodesToSearch.forEach(zip => queryParams.append("zipCodes", zip)); // Append each zip separately

            // Fetch dogs
            const response = await fetch(`${API_BASE_URL}/dogs/search?${queryParams.toString()}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch dog IDs");
            }

            const data = await response.json();
            setNextPage(data.next || null);
            fetchDogDetails(data.resultIds);
        } catch (error) {
            console.error("Error fetching dog IDs:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDogDetails = async (dogIds: string[]) => {
        const uniqueDogIds = [...new Set(dogIds)].slice(0, 100);

        if (!uniqueDogIds.length) {
            console.error("No valid dog IDs to fetch.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/dogs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(uniqueDogIds),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch dog details: ${response.status}`);
            }

            const dogData = await response.json();
            setDogs(dogData);

        } catch (error) {
            console.error(error);
        }
    };

    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        setPage(0);
    };

    useEffect(() => {
        setPage(0);
        setDogs([]);
        fetchDogIds();
    }, [sortOrder, breedFilter, zipCodeFilter, radiusFilter]);

    const displayedDogs = dogs.slice(page * pageSize, (page + 1) * pageSize);

    const handlePageChange = async (newPage: number) => {
        if (!nextPage) {
            console.warn("⚠️ No more pages available.");
            return;
        }

        await fetchDogIds();
        setPage(newPage);
    };

    return (
        <div>
            <h1 className="text-center my-6 text-[22px] font-semibold">Dog Directory 🐕</h1>

            <Box display="flex" justifyContent="center" mb={2} gap={3} alignItems="center" flexWrap="wrap">
                <TextField
                    label="Filter by Breed"
                    sx={{ width: "16rem" }}
                    value={breedFilter}
                    onChange={(e) => setBreedFilter(e.target.value)}
                />

                <TextField
                    label="Zip Code"
                    sx={{ width: "10rem" }}
                    value={zipCodeFilter}
                    onChange={(e) => setZipCodeFilter(e.target.value)}
                />

                <TextField
                    select
                    label="Radius (miles)"
                    sx={{ width: "10rem" }}
                    value={radiusFilter}
                    onChange={(e) => setRadiusFilter(Number(e.target.value))}
                >
                    <MenuItem value={10}>10 miles</MenuItem>
                    <MenuItem value={25}>25 miles</MenuItem>
                    <MenuItem value={50}>50 miles</MenuItem>
                    <MenuItem value={100}>100 miles</MenuItem>
                    <MenuItem value={200}>200 miles</MenuItem>
                </TextField>

                <Button
                    variant="contained"
                    endIcon={<ImportExportIcon />}
                    onClick={toggleSortOrder}
                    sx={{ backgroundColor: "#ffd869", color: "black", height: "40px", textTransform: "capitalize" }}
                >
                    Sort
                </Button>
            </Box>

            {loading && <Box display="flex" justifyContent="center" my={2}><CircularProgress size={24} /></Box>}

            <TableContainer component={Paper} sx={{ paddingBottom: "50px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Breed</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Zip Code</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedDogs.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No dogs found.</TableCell>
                            </TableRow>
                        )}
                        {displayedDogs.map((dog) => (
                            <TableRow key={dog.id}>
                                <TableCell><img src={dog.img} alt={dog.name} width="100" /></TableCell>
                                <TableCell>{dog.name}</TableCell>
                                <TableCell>{dog.breed}</TableCell>
                                <TableCell>{dog.age}</TableCell>
                                <TableCell>{dog.zip_code}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Box display="flex" justifyContent="center" mt={2} gap={1}>
                    <Button
                        variant="contained"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0}
                        sx={{ backgroundColor: "#ffd869", color: "black" }}
                    >
                        Prev
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={!nextPage}
                        sx={{ backgroundColor: "#ffd869", color: "black" }}
                    >
                        Next
                    </Button>
                </Box>

            </TableContainer>
        </div>
    );
};

export default DogTable;
