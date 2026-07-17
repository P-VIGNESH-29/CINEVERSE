import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch show list for home and search
export const tvshow = createAsyncThunk("tvshow", async () => {
  const response = await axios.get("https://api.tvmaze.com/shows");
  return response.data;
});

// Fetch detailed show information (with embedded cast)
export const fetchShowDetails = createAsyncThunk(
  "show/fetchDetails",
  async (id: string | number) => {
    const response = await axios.get(`https://api.tvmaze.com/shows/${id}?embed=cast`);
    return { id: String(id), data: response.data };
  }
);

// Fetch show seasons
export const fetchSeasons = createAsyncThunk(
  "show/fetchSeasons",
  async (id: string | number) => {
    const response = await axios.get(`https://api.tvmaze.com/shows/${id}/seasons`);
    return { id: String(id), data: response.data };
  }
);

// Fetch show episodes
export const fetchEpisodes = createAsyncThunk(
  "show/fetchEpisodes",
  async (id: string | number) => {
    const response = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
    return { id: String(id), data: response.data };
  }
);

// Fetch detailed single episode information
export const fetchEpisodeDetails = createAsyncThunk(
  "show/fetchEpisodeDetails",
  async (id: string | number) => {
    const response = await axios.get(`https://api.tvmaze.com/episodes/${id}`);
    return { id: String(id), data: response.data };
  }
);

interface ShowState {
  isloading: boolean;
  data: any[];
  error: boolean;
  searchQuery: string;
  
  // Cache storage mapping ID -> state
  showDetails: Record<string, { data: any; isloading: boolean; error: boolean }>;
  seasons: Record<string, { data: any[]; isloading: boolean; error: boolean }>;
  episodes: Record<string, { data: any[]; isloading: boolean; error: boolean }>;
  singleEpisodes: Record<string, { data: any; isloading: boolean; error: boolean }>;
}

const initialState: ShowState = {
  isloading: false,
  data: [],
  error: false,
  searchQuery: "",
  showDetails: {},
  seasons: {},
  episodes: {},
  singleEpisodes: {},
};

const showSlice = createSlice({
  name: "show",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    // tvshow show list
    builder.addCase(tvshow.pending, (state) => {
      state.isloading = true;
    });
    builder.addCase(tvshow.fulfilled, (state, action) => {
      state.isloading = false;
      state.data = action.payload;
    });
    builder.addCase(tvshow.rejected, (state) => {
      state.error = true;
      state.isloading = false;
    });

    // fetchShowDetails
    builder.addCase(fetchShowDetails.pending, (state, action) => {
      const showId = String(action.meta.arg);
      state.showDetails[showId] = { data: null, isloading: true, error: false };
    });
    builder.addCase(fetchShowDetails.fulfilled, (state, action) => {
      const { id, data } = action.payload;
      state.showDetails[id] = { data, isloading: false, error: false };
    });
    builder.addCase(fetchShowDetails.rejected, (state, action) => {
      const showId = String(action.meta.arg);
      state.showDetails[showId] = { data: null, isloading: false, error: true };
    });

    // fetchSeasons
    builder.addCase(fetchSeasons.pending, (state, action) => {
      const showId = String(action.meta.arg);
      state.seasons[showId] = { data: [], isloading: true, error: false };
    });
    builder.addCase(fetchSeasons.fulfilled, (state, action) => {
      const { id, data } = action.payload;
      state.seasons[id] = { data, isloading: false, error: false };
    });
    builder.addCase(fetchSeasons.rejected, (state, action) => {
      const showId = String(action.meta.arg);
      state.seasons[showId] = { data: [], isloading: false, error: true };
    });

    // fetchEpisodes
    builder.addCase(fetchEpisodes.pending, (state, action) => {
      const showId = String(action.meta.arg);
      state.episodes[showId] = { data: [], isloading: true, error: false };
    });
    builder.addCase(fetchEpisodes.fulfilled, (state, action) => {
      const { id, data } = action.payload;
      state.episodes[id] = { data, isloading: false, error: false };
    });
    builder.addCase(fetchEpisodes.rejected, (state, action) => {
      const showId = String(action.meta.arg);
      state.episodes[showId] = { data: [], isloading: false, error: true };
    });

    // fetchEpisodeDetails
    builder.addCase(fetchEpisodeDetails.pending, (state, action) => {
      const episodeId = String(action.meta.arg);
      state.singleEpisodes[episodeId] = { data: null, isloading: true, error: false };
    });
    builder.addCase(fetchEpisodeDetails.fulfilled, (state, action) => {
      const { id, data } = action.payload;
      state.singleEpisodes[id] = { data, isloading: false, error: false };
    });
    builder.addCase(fetchEpisodeDetails.rejected, (state, action) => {
      const episodeId = String(action.meta.arg);
      state.singleEpisodes[episodeId] = { data: null, isloading: false, error: true };
    });
  },
});

export const { setSearchQuery } = showSlice.actions;
export const showReducer = showSlice.reducer;
