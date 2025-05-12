const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getUserPlaces = async (req, res) => {
  try {
    const { uid } = req.params;
    const places = await prisma.place.findMany({
      where: { userId: uid }
    });

    res.json(places);
  } catch (error) {
    console.error('Get places error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPlaceDetail = async (req, res) => {
  try {
    const { placeId } = req.params;

    if (!placeId) {
      return res.status(400).json({ error: 'Invalid or missing place ID' });
    }

    const place = await prisma.place.findUnique({
      where: { id: placeId }
    });

    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }

    res.json(place);
  } catch (error) {
    console.error('Get place error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const createPlace = async (req, res) => {
  try {
    const { title, description, lat_long, location, image} = req.body;
    const userId = req.user.id;

    if (!title || !lat_long || !location) {
      return res.status(400).json({ error: 'Title, coordinates, and location are required' });
    }

    const place = await prisma.place.create({
      data: {
        title,
        description,
        lat_long,
        location,
        userId,
        imageUrl:image
      },
    });

    res.status(201).json(place);
  } catch (error) {
    console.error('Create place error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deletePlace = async (req, res) => {
  try {
    const placeId = req.params.placeId;
    const place = await prisma.place.findUnique({ where: { id: placeId } });
    const userId = req.user.id;

    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }

    if (place.userId !== userId) {
        return res.status(403).json({ error: 'Ta ustgah erhgui baina!' });
    }

    await prisma.place.delete({ where: { id: placeId } });
    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updatePlace = async (req, res) => {
  try {
    const placeId = req.params.placeId;
    const { title, description, location, lat_long } = req.body;
    const userId = req.user.id;

    const place = await prisma.place.findUnique({ where: { id: placeId } });
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }

    if (place.userId !== userId) {
        return res.status(403).json({ error: 'Ta ustgah erhgui baina!' });
    }

    const updatedPlace = await prisma.place.update({
      where: { id: placeId },
      data: {
        title: title || place.title,
        description: description || place.description,
        location: location || place.location,
        lat_long: lat_long || place.lat_long
      }
    });
    res.json(updatedPlace);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getUserPlaces,
  getPlaceDetail,
  createPlace,
  deletePlace,
  updatePlace
};