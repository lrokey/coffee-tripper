require 'yelp'
require 'httparty'
require 'polylines'

class RoutePlannerController < ApplicationController
	def search
		origin = params[:'pac-input']

		destination = params[:'pac-input-d']

		@distance = params[:distance]

		@rating = params[:rating]

		@stop_distance = params[:stop_distance]

  		route_url = "https://maps.googleapis.com/maps/api/directions/json?origin="+origin+"&destination="+destination
    	route_result = HTTParty.get(route_url).parsed_response

    	overview_polyline = route_result["routes"].first["overview_polyline"]["points"]

    	decode_polyline = Polylines::Decoder.decode_polyline(overview_polyline)

    	pruning = prune_array decode_polyline

    	results = yelp_search pruning
    	render :json => results

	end

	def find_distance lat1, lon1, lat2, lon2
		r = 6371000
		lat1_r = lat1 * (Math::PI / 180)
		lat2_r = lat2 * (Math::PI / 180)
		d_lat = (lat2-lat1) * (Math::PI / 180)
		d_lon = (lon2 - lon1) * (Math::PI / 180)

		a = Math.sin(d_lat/2) * Math.sin(d_lat/2) +
    	Math.cos(lat1_r) * Math.cos(lat2_r) *
    	Math.sin(d_lon/2) * Math.sin(d_lon/2)

    	c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    	d = r * c

    	e = d * 0.00062137
	end

	def prune_array decode_polyline
		pruned_array = Array.new
		j = 0
		k = 0
		for i in 0 ... decode_polyline.length - 1

			to_next_point = find_distance decode_polyline[j][0], decode_polyline[j][1], decode_polyline[i][0], decode_polyline[i][1]

			if to_next_point.to_f >= (@distance.to_f * 2) && to_next_point.to_f >= (@stop_distance.to_f * 60)
				pruned_array[k] = decode_polyline[i]
				j = i
				k = k + 1
			end
		end
		pruned_array
	end

	#yelp search
	def yelp_search pruning
		results_array = Array.new
		for i in 0 ... pruning.length
			parameters = { 	term: 'coffee',
							limit: 5,
							radius_filter: @distance.to_f*1609,
							sort: 1,
							category_filter: 'coffee'}
			coordinates = {
				latitude: pruning[i][0],
				longitude: pruning[i][1]
			}
			locale = { lang: 'us' }
	  		this_result = Yelp.client.search_by_coordinates(coordinates, parameters, locale)
	  		logger.debug ("#{this_result.businesses}")
	  		results_array.push(*this_result.businesses)
		end
		pruned_results_array = Array.new

		for i in 0 ... results_array.length
			logger.debug("#{results_array[i].rating}")
			if results_array[i].rating.to_f >= @rating.to_f
				pruned_results_array.push(*results_array[i])
			end
		end
		pruned_results_array
	end

end
