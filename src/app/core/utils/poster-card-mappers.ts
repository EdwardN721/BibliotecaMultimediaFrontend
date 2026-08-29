import { ItemDto } from '@core/models/item.model';
import { RespuestaUserItemDto } from '@core/models/biblioteca.model';
import { PosterCardItem } from '@shared/components/user/poster-card/poster-card';

/** Mapea un ítem del catálogo a la tarjeta compartida de PosterCard. */
export function mapearItemCatalogo(item: ItemDto): PosterCardItem {
  return {
    id: item.id,
    titulo: item.title,
    imageUrl: item.mainImageUrl,
    subtitulo: [
      item.mediaType,
      ...item.formats.slice(0, 2),
      item.releaseDate ? new Date(item.releaseDate).getFullYear() : null,
      item.platforms.slice(0, 2).join(' / '),
    ]
      .filter(Boolean)
      .join(' • '),
    descripcion: item.descripcion,
    ratingCatalogo: item.ratingPromedio ?? undefined,
  };
}

/** Mapea una entrada de biblioteca del usuario a la tarjeta compartida de PosterCard. */
export function mapearItemBiblioteca(item: RespuestaUserItemDto): PosterCardItem {
  return {
    id: item.itemId,
    userItemId: item.id,
    titulo: item.titulo,
    imageUrl: item.imageUrl,
    subtitulo: [item.mediaType, ...item.formats].filter(Boolean).join(' • '),
    descripcion: undefined,
    personalRating: item.personalRating ?? undefined,
    status: item.status,
    isFavorite: item.isFavorite,
    enBiblioteca: true,
  };
}
