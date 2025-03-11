import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, TextField } from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';

const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

const DogTable: React.FC = () => {
    const [dogs, setDogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [nextPage, setNextPage] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [breedFilter, setBreedFilter] = useState("");
    const pageSize = 5;

    const fetchDogIds = async (url: string) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}${url}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("❌ Failed to fetch dog IDs");
            }

            const data = await response.json();
            console.log("📡 API Response:", data);

            if (!data.resultIds || !data.resultIds.length) {
                console.warn("⚠️ No dog IDs returned!");
                return;
            }

            setNextPage(data.next || null);

            const uniqueIds = [...new Set([...dogs.map(d => d.id), ...data.resultIds])];
            fetchDogDetails(uniqueIds);
        } catch (error) {
            console.error("❌ Error fetching dog IDs:", error);
        } finally {
            setLoading(false);
        }
    };


    const fetchDogDetails = async (dogIds: string[]) => {
        const uniqueDogIds = [...new Set(dogIds)].slice(0, 100);

        if (!uniqueDogIds.length) {
            console.error("❌ No valid dog IDs to fetch.");
            return;
        }

        console.log("📡 Fetching details for these dog IDs:", uniqueDogIds);

        try {
            const response = await fetch(`${API_BASE_URL}/dogs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(uniqueDogIds),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`❌ Failed to fetch dog details: ${response.status}`);
            }

            const dogData = await response.json();

            setDogs((prevDogs) => {
                const allDogs = [...prevDogs, ...dogData];
                return Array.from(new Map(allDogs.map(dog => [dog.id, dog])).values());
            });

        } catch (error) {
            console.error(error);
        }
    };


    const toggleSortOrder = () => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    useEffect(() => {
        setPage(0);
        // One way this could be improved is to make the search case insensitive and partial match friendly.
        fetchDogIds(`/dogs/search?size=25&sort=breed:${sortOrder}${breedFilter ? `&breeds=${encodeURIComponent(breedFilter)}` : ""}`)
            .then(() => setDogs([]));
    }, [sortOrder, breedFilter]);

    const displayedDogs = dogs.slice(page * pageSize, (page + 1) * pageSize);

    const handlePageChange = async (newPage: number) => {
        if (!nextPage) {
            console.warn("⚠️ No more pages available.");
            return;
        }

        console.log(`📡 Fetching page ${newPage + 1}: ${nextPage}`);
        await fetchDogIds(nextPage);
        setPage(newPage);
    };


    return (
        <div>
            <h2>Dog Directory 🐕</h2>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box minWidth="40px">
                    {loading ? <CircularProgress size={24} /> : <span style={{ visibility: "hidden" }}>.</span>}
                </Box>
                <Button
                    variant="contained"
                    startIcon={<SortIcon />}
                    onClick={toggleSortOrder}
                >
                    Sort by Breed ({sortOrder === "asc" ? "A → Z" : "Z → A"})
                </Button>
                <TextField
                    label="Filter by Breed"
                    variant="outlined"
                    size="small"
                    value={breedFilter}
                    onChange={(e) => setBreedFilter(e.target.value)}
                />
            </Box>


            <TableContainer component={Paper}>
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
                                <TableCell colSpan={5} align="center">
                                    ❌ No dogs found.
                                </TableCell>
                            </TableRow>
                        )}
                        {displayedDogs.map((dog) => (
                            <TableRow key={dog.id}>
                                <TableCell>
                                    <Box
                                        component="img"
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: 1,
                                            objectFit: "cover"
                                        }}
                                        alt={dog.name}
                                        src={dog.img}
                                        onError={(e) => console.error(`❌ Image failed to load: ${e}`)}
                                    />
                                </TableCell>
                                <TableCell>{dog.name}</TableCell>
                                <TableCell>{dog.breed}</TableCell>
                                <TableCell>{dog.age}</TableCell>
                                <TableCell>{dog.zip_code}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>

            <Box display="flex" justifyContent="center" mt={2} gap={1}>
                <Button
                    variant="contained"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                >
                    Prev
                </Button>


                <Button
                    variant="contained"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!nextPage}
                >
                    Next
                </Button>
            </Box>




        </div>
    );
};

export default DogTable;
